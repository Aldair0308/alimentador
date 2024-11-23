import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DispenserService } from './dispenser.service';
import { CreateDispenserDto } from './dto/create-dispenser.dto';
import { UpdateDispenserDto } from './dto/update-dispenser.dto';
import { Dispenser } from './schema/dispenser.schema';

@Controller('dispenser')
export class DispenserController {
  constructor(private readonly dispenserService: DispenserService) {}

  @Post()
  async create(
    @Body() createDispenserDto: CreateDispenserDto,
  ): Promise<Dispenser> {
    return this.dispenserService.create(createDispenserDto);
  }

  @Get()
  async findAll(): Promise<Dispenser[]> {
    return this.dispenserService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Dispenser> {
    return this.dispenserService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDispenserDto: UpdateDispenserDto,
  ): Promise<Dispenser> {
    return this.dispenserService.update(id, updateDispenserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Dispenser> {
    return this.dispenserService.remove(id);
  }
}
