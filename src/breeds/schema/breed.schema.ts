import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BreedDocument = Breed & Document;

@Schema()
export class Breed {
  @Prop({ required: true })
  raza: string;

  @Prop({
    required: true,
    enum: ['chico', 'mediano', 'grande'],
  })
  categoria: string;

  @Prop({ required: true })
  tamaño: string;

  @Prop({ required: true })
  vida: string;

  @Prop({ required: true })
  peso: string;

  @Prop({ required: true })
  gramos: number;

  @Prop({ required: true })
  veces: number;

  @Prop({ required: true })
  porcion: number;

  @Prop({ required: true, type: [String] })
  horas: string[];

  @Prop({ required: true })
  info: string;

  @Prop()
  foto?: string;
}

export const BreedSchema = SchemaFactory.createForClass(Breed);
