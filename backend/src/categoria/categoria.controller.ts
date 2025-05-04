import { Controller,HttpStatus,HttpException, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('evento/categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  // Edita relacion evento_categoria
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put('evento/:id_evento')
  async updateCategoriasEvento(
    @Param('id_evento') id_evento: string, 
    @Body() categorias: { id_categoria: number }[]
  ) {
    const eventoId = parseInt(id_evento, 10);

    if (isNaN(eventoId)) {
      throw new HttpException(
        'El id_evento debe ser un número válido',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.categoriaService.updateCategoriasDeEvento(eventoId, categorias);
  }

  // Proporciona relacion evento_categoria
  @UseGuards(JwtAuthGuard, CasbinGuard) 
  @Get('evento/:id_evento')
  async getCategoriasByEvento(@Param('id_evento') id_evento: string) {
    const eventoId = parseInt(id_evento, 10);
    if (isNaN(eventoId)) {
      throw new Error('El id_evento debe ser un número válido');
    }
    return this.categoriaService.getCategoriasByEvento(eventoId);
  }

  // creamos una categoria
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  // retornamos todas las categorias
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  // retornamos una categoria
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id);
  }

  // editamos una categoria
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriaService.update(+id, updateCategoriaDto);
  }

  // eliminamos una categoria
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(+id);
  }

}
