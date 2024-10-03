import { Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Breed, BreedSchema } from './schema/breed.schema'; // Asegúrate de que el esquema esté correctamente exportado

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Breed.name, schema: BreedSchema }]),
  ],
  controllers: [BreedsController],
  providers: [BreedsService],
})
export class BreedsModule {}
