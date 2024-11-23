import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Distancia extends Document {
  @Prop({ required: true })
  porcentaje: number;

  @Prop({ required: true })
  distancia_cm: number;

  @Prop({ required: true, default: Date.now })
  fecha: Date;

  @Prop({ default: 'cerrado' })
  estado: string;

  @Prop({ required: true })
  code: string;
}

export const DistanciaSchema = SchemaFactory.createForClass(Distancia);
