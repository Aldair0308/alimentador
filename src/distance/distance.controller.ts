import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DistanciaService } from './distance.service';
import { Distancia } from './schema/distance.schema';

@Controller('distancias')
export class DistanciaController {
  constructor(private readonly distanciaService: DistanciaService) {}

  @Post()
  async create(
    @Body() distanciaDto: { distancia_cm: number; fecha?: Date },
  ): Promise<Distancia> {
    return this.distanciaService.create(distanciaDto);
  }

  @Get()
  async findAll(): Promise<Distancia[]> {
    return this.distanciaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Distancia> {
    return this.distanciaService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() distanciaDto: { distancia_cm: number; fecha?: Date },
  ): Promise<Distancia> {
    return this.distanciaService.update(id, distanciaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Distancia> {
    return this.distanciaService.remove(id);
  }
}
