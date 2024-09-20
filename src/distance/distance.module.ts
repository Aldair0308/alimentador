import { Module } from '@nestjs/common';
import { DistanciaController } from './distance.controller';
import { DistanciaService } from './distance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Distancia, DistanciaSchema } from './schema/distance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Distancia.name, schema: DistanciaSchema },
    ]),
  ],
  controllers: [DistanciaController],
  providers: [DistanciaService],
})
export class DistanceModule {}
