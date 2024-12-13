import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { google } from 'googleapis';

@Injectable()
export class PlaylistService {
  private readonly youtube;

  constructor(private readonly prisma: PrismaService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY, // 유튜브 API 키 환경변수로 설정
    });
  }

  // 1. 플레이리스트 생성
  async createPlaylist(dto: CreatePlaylistDto, userId: number): Promise<any> {
    const { title, description, tags } = dto;

    const playlist = await this.prisma.playlist.create({
      data: {
        title,
        description,
        user: { connect: { id: userId } },
      },
    });

    if (tags && tags.length > 0) {
      await Promise.all(
        tags.map(async (tag) => {
          await this.prisma.playlistTag.create({
            data: {
              playlist: { connect: { id: playlist.id } },
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
            },
          });
        }),
      );
    }

    return playlist;
  }

  // 2. 플레이리스트 수정
  async updatePlaylist(id: number, userId: number, dto: UpdatePlaylistDto): Promise<any> {
    const { title, description, tags } = dto;

    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!playlist || playlist.userId !== userId) {
      throw new UnauthorizedException('수정 권한이 없습니다.');
    }

    const updatedPlaylist = await this.prisma.playlist.update({
      where: { id },
      data: { title, description },
    });

    if (tags && tags.length > 0) {
      await this.prisma.playlistTag.deleteMany({ where: { playlistId: id } });

      await Promise.all(
        tags.map(async (tag) => {
          await this.prisma.playlistTag.create({
            data: {
              playlist: { connect: { id } },
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
            },
          });
        }),
      );
    }

    return updatedPlaylist;
  }

  // 3. 플레이리스트 삭제
  async deletePlaylist(id: number): Promise<string> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw new NotFoundException(`ID ${id}를 찾을 수 없습니다.`);
    }

    await this.prisma.playlist.delete({ where: { id } });
    return `플레이리스트 ID ${id} 삭제 완료`;
  }

  // 4. 동영상 추가
  async addVideo(playlistId: number, dto: AddVideoDto): Promise<any> {
    const { youtubeId, title, channelName, thumbnailUrl, duration, order } = dto;

    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException(`ID ${playlistId}를 찾을 수 없습니다.`);
    }

    const video = await this.prisma.video.create({
      data: {
        playlistId,
        youtubeId,
        title,
        channelName,
        thumbnailUrl,
        duration,
        order: order ?? 0,
      },
    });

    return video;
  }

  // 5. 플레이리스트 상세 조회
  async getPlaylistDetails(id: number): Promise<any> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        tags: true,
        videos: {
          select: {
            id: true,
            title: true,
            youtubeId: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    if (!playlist) {
      throw new NotFoundException(`플레이리스트를 찾을 수 없습니다.`);
    }

    return {
      ...playlist,
      videos: playlist.videos.map((video) => ({
        id: video.id,
        title: video.title,
        url: `https://youtube.com/watch?v=${video.youtubeId}`,
      })),
    };
  }

  // 6. 플레이리스트 곡 제거
  async removeVideo(playlistId: number, videoId: number): Promise<any> {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });

    if (!video || video.playlistId !== playlistId) {
      throw new NotFoundException(`비디오 ID ${videoId}를 찾을 수 없습니다.`);
    }

    await this.prisma.video.delete({ where: { id: videoId } });

    return {
      playlistId,
      videoId,
      message: '곡 제거 성공',
    };
  }
}
