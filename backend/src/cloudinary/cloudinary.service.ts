import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import '../cloudinary/cloudinary.config';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    carpeta: string = 'otros'
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: carpeta },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No se pudo subir la imagen'));
          resolve(result);
        },
      );

      // 👇 Envolver el buffer como stream y enviarlo
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }
}
