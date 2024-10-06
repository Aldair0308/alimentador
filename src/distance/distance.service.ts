import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Distancia } from './schema/distance.schema';

@Injectable()
export class DistanciaService {
  constructor(
    @InjectModel(Distancia.name)
    private readonly distanciaModel: Model<Distancia>,
  ) {}

  async create(distanciaDto: {
    distancia_cm: number;
    fecha?: Date; // Agregamos fecha aquí para que TypeScript lo reconozca
  }): Promise<Distancia> {
    // Usar la fecha y hora actual en la zona horaria de CDMX
    const fechaActualCDMX = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Mexico_City',
      }),
    );

    // Asignar la fecha actual al objeto distanciaDto
    distanciaDto.fecha = fechaActualCDMX;

    const nuevaDistancia = new this.distanciaModel(distanciaDto);
    return nuevaDistancia.save();
  }

  async findAll(): Promise<Distancia[]> {
    return this.distanciaModel.find().exec();
  }

  async findOne(id: string): Promise<Distancia> {
    return this.distanciaModel.findById(id).exec();
  }

  async update(
    id: string,
    distanciaDto: { distancia_cm: number; fecha?: Date }, // Agregamos fecha aquí también
  ): Promise<Distancia> {
    // Usar la fecha y hora actual en la zona horaria de CDMX
    const fechaActualCDMX = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Mexico_City',
      }),
    );

    // Asignar la fecha actual al objeto distanciaDto
    distanciaDto.fecha = fechaActualCDMX;

    return this.distanciaModel
      .findByIdAndUpdate(id, distanciaDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Distancia> {
    return this.distanciaModel.findByIdAndDelete(id).exec();
  }

  async findLast(): Promise<{ porcentaje: number }> {
    const lastDistancia = await this.distanciaModel
      .findOne()
      .sort({ fecha: -1 })
      .exec();

    console.log('Última distancia:', lastDistancia); // Agregar este log
    return { porcentaje: lastDistancia ? lastDistancia.porcentaje : null };
  }
}
