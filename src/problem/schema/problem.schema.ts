import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProblemDocument = Problem & Document;

@Schema()
export class Problem {
  @Prop({ required: true })
  problema: string;

  @Prop({
    required: true,
    enum: ['pendiente', 'en revision', 'resuelto'],
    default: 'en revision',
  })
  estado: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true })
  categoria: string;

  @Prop({ required: false, type: Date, default: Date.now })
  fecha: Date;

  @Prop({ required: true })
  responsable: string;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
