import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema()
export class Pet {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  raza: string;

  @Prop({
    required: true,
    enum: ['pequeño', 'mediano', 'grande'],
  })
  categoria: string;

  @Prop({ required: true })
  gramos: number;

  @Prop({ required: true })
  veces: number;

  @Prop({ required: true })
  porcion: number;

  @Prop({ required: true, type: [String] })
  horas: string[];

  @Prop({ required: true })
  edad: string;

  @Prop({ required: true })
  code: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
