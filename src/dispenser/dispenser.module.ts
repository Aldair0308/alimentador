import { Module } from '@nestjs/common';
import { DispenserService } from './dispenser.service';
import { DispenserController } from './dispenser.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dispenser, DispenserSchema } from './schema/dispenser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dispenser.name, schema: DispenserSchema },
    ]),
  ],
  controllers: [DispenserController],
  providers: [DispenserService],
})
export class DispenserModule {}
