import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';

@Injectable()
export class UsuarioService {
  // Guarda temporalmente el body - código - tiempo de expiración
  private pendingVerifications = new Map<string, { 
    data: CreateUsuarioDto; 
    code: string; 
    expired: boolean;
    timeout: NodeJS.Timeout 
  }>();

  constructor(private prisma: PrismaService, private emailService: EmailService) {}

  async getUsers() {
    return await this.prisma.usuario.findMany();
  }

  async registerUser(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el correo ya está registrado
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado.');
    }

    // Generar código de verificación
    return await this.generateVerificationCode(createUsuarioDto);
  }

  async generateVerificationCode(createUsuarioDto: CreateUsuarioDto) {
    const email = createUsuarioDto.email;

    // Generar código aleatorio de 5 dígitos
    //const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    
    // Si ya existe un código previo, eliminarlo
    if (this.pendingVerifications.has(email)) {
      clearTimeout(this.pendingVerifications.get(email)?.timeout);
      this.pendingVerifications.delete(email);
    }

    // Configurar eliminación automática en 2 minutos (120000 ms)
    const timeout = setTimeout(() => {
      const pendingData = this.pendingVerifications.get(email);
      if (pendingData) {
        pendingData.expired = true;
        console.log(`⏳ Código de verificación expirado para: ${email}`);
      }
    }, 120000);

    this.pendingVerifications.set(email, {
      data: createUsuarioDto,
      code: verificationCode,
      expired: false,
      timeout,
    });

    await this.emailService.sendVerificationEmail(email, verificationCode);

    return { message: 'Código de verificación enviado. Revisa tu correo.' };
  }

  async verifyAndCreateUser(email: string, code: string) {
    const pendingData = this.pendingVerifications.get(email);

    if (!pendingData) {
      throw new BadRequestException('No se encontró una solicitud de verificación o ya expiró.');
    }

    if (pendingData.expired) {
      throw new BadRequestException('El código de verificación ha expirado. Solicita un nuevo código.');
    }

    if (pendingData.code !== code) {
      throw new BadRequestException('Código incorrecto.');
    }

    clearTimeout(pendingData.timeout);

    const hashedPassword = await bcrypt.hash(pendingData.data.contrasena, 10);

    const newUser = await this.prisma.usuario.create({
      data: {
        nombre: pendingData.data.nombre,
        apellidoPaterno: pendingData.data.apellidoPaterno,
        apellidoMaterno: pendingData.data.apellidoMaterno,
        email: pendingData.data.email,
        contrasena: hashedPassword,
        telefono: pendingData.data.telefono,
        pais: pendingData.data.pais,
        ciudad: pendingData.data.ciudad,
        genero: pendingData.data.genero,
      },
    });

    this.pendingVerifications.delete(email);

    return { message: 'Usuario registrado con éxito' };
  }


  async resendVerificationCode(email: string) {
    console.log("📩 Intentando reenviar código para:", email);
  
    if (!email) {
      console.log("ERROR: El email recibido es vacío.");
      throw new BadRequestException("El email es requerido.");
    }
  
  
    let pendingData = this.pendingVerifications.get(email);
  
    if (!pendingData) {
      console.log(`No se encontró un código para: ${email}`);
      throw new BadRequestException('No se encontró un registro de usuario pendiente.');
    }
  
    if (pendingData.expired) {
      console.log(`Código expirado. Generando uno nuevo para: ${email}`);
      return await this.generateVerificationCode(pendingData.data);
    }
  
    console.log(`Código aún válido. Reenviando para: ${email}`);
    await this.emailService.sendVerificationEmail(email, pendingData.code);
  
    return { message: 'Código reenviado. Revisa tu correo.' };
  }
  

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async remove(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return await this.prisma.usuario.delete({ where: { id } });
  }

  async updateUser(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
    }

    return await this.prisma.usuario.update({
      where: { id },
      data: { ...updateUsuarioDto },
    });
  }
}
