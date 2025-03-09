import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';

@Injectable()
export class UsuarioService {
  // Guarda temporalmente el body - codigo - tiempo(expira)
  private pendingVerifications = new Map<string, { data: CreateUsuarioDto; code: string; timeout: NodeJS.Timeout }>();

  // Base de datos y el Email
  constructor(private prisma: PrismaService, private emailService: EmailService) {}

  // todos los usuarios
  async getUsers() {
    return await this.prisma.usuario.findMany();
  }

  // registra
  async registerUser(createUsuarioDto: CreateUsuarioDto) {
    // Verifica si el correo ya está registrado
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado.');
    }

    // Genera el codigo de verificacion
    return await this.generateVerificationCode(createUsuarioDto);
  }

  async generateVerificationCode(createUsuarioDto: CreateUsuarioDto) {
    const email = createUsuarioDto.email;

    // código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Elimina código anterior si existe
    if (this.pendingVerifications.has(email)) {
      clearTimeout(this.pendingVerifications.get(email)?.timeout);
      this.pendingVerifications.delete(email);
    }

    // Configurar eliminación automática en 1 minuto // 60000 ms = 1 minuto
    const timeout = setTimeout(() => {
      this.pendingVerifications.delete(email);
      console.log(`Código de verificación expirado para: ${email}`);
    }, 60000);

    // Guardar datos del usuario junto con el nuevo código
    this.pendingVerifications.set(email, {
      data: createUsuarioDto,
      code: verificationCode,
      timeout,
    });

    // Enviar el código por correo
    await this.emailService.sendVerificationEmail(email, verificationCode);

    return { message: 'Codigo de verificación enviado. Revisa tu correo.' };
  }

  async verifyAndCreateUser(email: string, code: string) {
    const pendingData = this.pendingVerifications.get(email);

    if (!pendingData) {
      throw new BadRequestException('No se encontró una solicitud de verificación o ya expiró.');
    }

    if (pendingData.code !== code) {
      throw new BadRequestException('Código incorrecto.');
    }

    // Cancelar la eliminación programada
    clearTimeout(pendingData.timeout);

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(pendingData.data.contrasena, 10);

    // Crear usuario en la base de datos
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

    return { message: 'Usuario registrado con éxito'};
  }

  //reenvia el mensaje
  async resendVerificationCode(email: string) {
    const pendingData = this.pendingVerifications.get(email);

    if (!pendingData) {
      throw new BadRequestException('No se encontró un registro de usuario pendiente.');
    }

    return await this.generateVerificationCode(pendingData.data);
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

  // Actualizar usuario por ID
  async updateUser(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si el usuario intenta cambiar la contraseña, la encriptamos
    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
    }

    // Actualizar usuario en la base de datos
    return await this.prisma.usuario.update({
      where: { id },
      data: { ...updateUsuarioDto },
    });
  }
}
