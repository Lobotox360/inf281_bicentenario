import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, DeleteApiResponse, UploadApiResponse } from 'cloudinary';
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

 async eliminarImagen(url: string): Promise<DeleteApiResponse> {
  return new Promise<DeleteApiResponse>((resolve, reject) => {
    // Extraer el ID público de la URL de Cloudinary
    const publicId = this.extraerPublicIdDeUrl(url);

    if (!publicId) {
      return reject(new Error('URL no válida o no contiene un ID público'));
    }

    cloudinary.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

private extraerPublicIdDeUrl(url: string): string | null {
  try {
    // ✅ Mejoramos la expresión para incluir carpetas y cualquier extensión
    const matches = url.match(/\/([^/]+\/[^/]+)\.(jpg|jpeg|png|gif|webp)/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}

}
