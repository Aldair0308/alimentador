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

  @Get('signals')
  getSignals(): string[] {
    console.log('Fetching signals...');
    const signals = this.distanciaService.getSignals();
    console.log('Current signals:', signals);
    return signals;
  }

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

  @Get('last/code/:code')
  async findLastByCode(
    @Param('code') code: string,
  ): Promise<{ porcentaje: number }> {
    return this.distanciaService.findLastByCode(code);
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

  @Post('update-last-state')
  async updateLastState(
    @Body() body: { estado: string },
  ): Promise<{ message: string }> {
    const updatedRecord = await this.distanciaService.updateLastState(
      body.estado,
    );
    if (!updatedRecord) {
      return { message: 'No hay registros disponibles para actualizar.' };
    }
    return {
      message: `Estado del último registro actualizado a "${body.estado}"`,
    };
  }

  // Ruta para agregar una señal
  @Post('signal')
  addSignal(@Body('signal') signal: string): { message: string } {
    this.distanciaService.addSignal(signal);
    return { message: 'Señal recibida exitosamente' };
  }

  // Ruta para limpiar las señales
  @Get('signals/clear')
  clearSignals(): { message: string } {
    this.distanciaService.clearSignals();
    return { message: 'Señales limpiadas exitosamente' };
  }
}
