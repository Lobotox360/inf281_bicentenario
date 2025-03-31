import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import '../cloudinary/cloudinary.config'; // 👈 Esto fuerza que se ejecute el archivo


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
  
      uploadStream.end(file.buffer);
    });
  }  
}
