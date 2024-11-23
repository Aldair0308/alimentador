import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DispenserDocument = Dispenser & Document;

@Schema()
export class Dispenser {
  @Prop()
  id_v: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  wifi: string;

  @Prop({ required: true })
  password: string;
}

export const DispenserSchema = SchemaFactory.createForClass(Dispenser);
