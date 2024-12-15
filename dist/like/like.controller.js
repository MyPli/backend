"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLikesController = exports.LikeController = void 0;
const common_1 = require("@nestjs/common");
const like_service_1 = require("./like.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let LikeController = class LikeController {
    constructor(likeService) {
        this.likeService = likeService;
    }
    async addLike(playlistId, req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('인증이 필요합니다.');
        }
        return this.likeService.addLike(userId, playlistId);
    }
    async removeLike(playlistId, req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('인증이 필요합니다.');
        }
        return this.likeService.removeLike(userId, playlistId);
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "addLike", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "removeLike", null);
exports.LikeController = LikeController = __decorate([
    (0, common_1.Controller)('playlists/:id/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
let UserLikesController = class UserLikesController {
    constructor(likeService) {
        this.likeService = likeService;
    }
    async getLikedPlaylists(req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('인증이 필요합니다.');
        }
        return this.likeService.getLikedPlaylists(userId);
    }
};
exports.UserLikesController = UserLikesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserLikesController.prototype, "getLikedPlaylists", null);
exports.UserLikesController = UserLikesController = __decorate([
    (0, common_1.Controller)('users/me/likes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], UserLikesController);
//# sourceMappingURL=like.controller.js.map