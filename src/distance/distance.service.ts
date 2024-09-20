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
    fecha?: Date;
  }): Promise<Distancia> {
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
    distanciaDto: { distancia_cm: number; fecha?: Date },
  ): Promise<Distancia> {
    return this.distanciaModel
      .findByIdAndUpdate(id, distanciaDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Distancia> {
    return this.distanciaModel.findByIdAndDelete(id).exec();
  }
}
