import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsuarioService {

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Almacena email -> { id, code, expired, timeout }
  private pendingVerifications = new Map<string, {
    userId: string;
    code: string;
    expired: boolean;
    timeout: NodeJS.Timeout;
  }>();


  async registerUser(createUsuarioDto: CreateUsuarioDto) {
    const existing = await this.prisma.usuarios.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existing) {
      throw new BadRequestException('El correo ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, 10);

    const newUser = await this.prisma.usuarios.create({
      data: {
        nombre: createUsuarioDto.nombre,
        apellidopaterno: createUsuarioDto.apellidopaterno,
        apellidomaterno: createUsuarioDto.apellidomaterno,
        email: createUsuarioDto.email,
        contrasena: hashedPassword,
        telefono: createUsuarioDto.telefono,
        pais: createUsuarioDto.pais,
        ciudad: createUsuarioDto.ciudad,
        genero: createUsuarioDto.genero,
        foto: createUsuarioDto.foto || 'fotodefecto',
        verificado: false,
        Roles: {
          connect: { id_rol: 1 },
        },
      },
    });
    
    

    await this.generateVerificationCode(newUser.id_usuario, newUser.email);

    return { message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.' };
  }

  private async generateVerificationCode(userId: string, email: string) {
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    if (this.pendingVerifications.has(email)) {
      clearTimeout(this.pendingVerifications.get(email)?.timeout);
      this.pendingVerifications.delete(email);
    }

    const timeout = setTimeout(() => {
      const item = this.pendingVerifications.get(email);
      if (item) {
        item.expired = true;
        console.log(`⏳ Código expirado para: ${email}`);
      }
    }, 120000); // 2 minutos

    this.pendingVerifications.set(email, {
      userId,
      code,
      expired: false,
      timeout,
    });

    await this.emailService.sendVerificationEmail(email, code);
  }

  async verifyUser(email: string, code: string) {
    const usu = this.pendingVerifications.get(email);

    if (!usu) {
      throw new BadRequestException('No se encontró un código de verificación o ya expiró.');
    }

    if (usu.expired) {
      throw new BadRequestException('El código ha expirado.');
    }

    if (usu.code !== code) {
      throw new BadRequestException('El código es incorrecto.');
    }

    await this.prisma.usuarios.update({
      where: { email },
      data: {
        verificado: true,
      },
    });

    clearTimeout(usu.timeout);
    this.pendingVerifications.delete(email);

    return { message: 'Cuenta verificada exitosamente ✅' };
  }

  async resendVerificationCode(email: string) {
    const user = await this.prisma.usuarios.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('No se encontró el usuario.');
    }

    if (user.verificado) {
      throw new BadRequestException('Este usuario ya está verificado.');
    }

    await this.generateVerificationCode(user.id_usuario, email);
    return { message: 'Nuevo código generado. Revisa tu correo.' };
  }
  
  async guardarFotoEnCloudinary(email: string, file: Express.Multer.File) {
    const user = await this.prisma.usuarios.findUnique({ where: { email } });
  
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  
    const result = await this.cloudinaryService.uploadImage(file, 'perfil_usuario');
  
    await this.prisma.usuarios.update({
      where: { email },
      data: {
        foto: result.secure_url,
      },
    });
    
    return {
      message: '✅ Foto subida exitosamente',
    };
  }

  
  async findAll() {
    return await this.prisma.usuarios.findMany();
  }
  

  async findOne(id: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }


  async remove(id: string) {
    const usuario = await this.prisma.usuarios.findUnique({ where: { id_usuario: id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return await this.prisma.usuarios.delete({ where: { id_usuario: id } });
  }

  async updateUser(id: string, updateUsuarioDto: UpdateUsuarioDto) {
  const usuario = await this.prisma.usuarios.findUnique({ where: { id_usuario: id } });

  if (!usuario) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }

  if (updateUsuarioDto.contrasena) {
    updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
  }

  return await this.prisma.usuarios.update({
    where: { id_usuario: id },
    data: { ...updateUsuarioDto },
  });
}

    
}
