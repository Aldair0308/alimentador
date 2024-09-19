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
  tamaño: string;

  @Prop({ required: true })
  gramos: number;

  @Prop({ required: true, type: [String] }) // Actualizado para permitir un arreglo de strings
  horas: string[];
}

export const PetSchema = SchemaFactory.createForClass(Pet);
