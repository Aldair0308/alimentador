import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Distancia } from './schema/distance.schema';

@Injectable()
export class DistanciaService {
  constructor(
    @InjectModel(Distancia.name)
    private readonly distanciaModel: Model<Distancia>,
  ) {
    // Inicia el proceso automático al instanciar el servicio
    this.startAutoCleanup();
  }

  async create(distanciaDto: {
    distancia_cm: number;
    fecha?: Date;
  }): Promise<Distancia> {
    const fechaActualCDMX = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Mexico_City',
      }),
    );

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
    distanciaDto: { distancia_cm: number; fecha?: Date },
  ): Promise<Distancia> {
    const fechaActualCDMX = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Mexico_City',
      }),
    );

    distanciaDto.fecha = fechaActualCDMX;

    return this.distanciaModel
      .findByIdAndUpdate(id, distanciaDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Distancia> {
    return this.distanciaModel.findByIdAndDelete(id).exec();
  }

  async findLastByCode(
    code: string,
  ): Promise<{ porcentaje: number; estado: string | null }> {
    const lastDistancia = await this.distanciaModel
      .findOne({ code })
      .sort({ fecha: -1 })
      .exec();

    console.log('Última distancia con código:', lastDistancia);

    return {
      porcentaje: lastDistancia ? lastDistancia.porcentaje : null,
      estado: lastDistancia ? lastDistancia.estado : null,
    };
  }

  async updateLastState(estado: string): Promise<Distancia | null> {
    const lastDistancia = await this.distanciaModel
      .findOne()
      .sort({ fecha: -1 })
      .exec();

    if (!lastDistancia) {
      return null;
    }

    lastDistancia.estado = estado;
    return lastDistancia.save();
  }

  // Nueva función para mantener solo los últimos 10 registros por código
  private async cleanUpOldRecords(codes: string[]) {
    for (const code of codes) {
      const registros = await this.distanciaModel
        .find({ code })
        .sort({ fecha: -1 }) // Ordena de más reciente a más antiguo
        .exec();

      if (registros.length > 10) {
        const idsToRemove = registros
          .slice(10) // Obtén los registros antiguos
          .map((reg) => reg._id);

        await this.distanciaModel
          .deleteMany({ _id: { $in: idsToRemove } })
          .exec();
        console.log(`Eliminados registros antiguos del código: ${code}`);
      }
    }
  }

  // Nueva función para realizar el GET y procesar los datos usando fetch
  private async fetchCodesAndCleanUp() {
    try {
      const response = await fetch(
        'https://alimentador-production-15ae.up.railway.app/pets/codes',
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const codesData: { code: string; horas: string[] }[] =
        await response.json();

      const codes = codesData.map((item) => item.code);
      await this.cleanUpOldRecords(codes);
    } catch (error) {
      console.error('Error al obtener códigos o limpiar registros:', error);
    }
  }

  // Nueva función para iniciar el proceso automático
  private startAutoCleanup() {
    setInterval(() => {
      this.fetchCodesAndCleanUp();
    }, 30000); // Ejecuta cada 30 segundos
  }
}
