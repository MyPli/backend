"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const crypto = require("crypto");
let S3Service = class S3Service {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    }
    async uploadImage(userId, fileBuffer, fileType) {
        try {
            const fileName = `mypli_users/profile_${crypto.randomUUID()}.${fileType}`;
            const uploadResult = await this.s3
                .upload({
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileBuffer,
                ContentType: `image/${fileType}`,
            })
                .promise();
            return uploadResult.Location;
        }
        catch (error) {
            console.error('S3 Upload Error:', error);
            throw new common_1.InternalServerErrorException('S3 업로드 중 오류 발생');
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)()
], S3Service);
//# sourceMappingURL=s3.service.js.map