import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDispenserDto } from './dto/create-dispenser.dto';
import { UpdateDispenserDto } from './dto/update-dispenser.dto';
import { Dispenser, DispenserDocument } from './schema/dispenser.schema';

@Injectable()
export class DispenserService {
  constructor(
    @InjectModel(Dispenser.name)
    private dispenserModel: Model<DispenserDocument>,
  ) {}

  async create(createDispenserDto: CreateDispenserDto): Promise<Dispenser> {
    const newDispenser = new this.dispenserModel(createDispenserDto);
    return newDispenser.save();
  }

  async findAll(): Promise<Dispenser[]> {
    return this.dispenserModel.find().exec();
  }

  async findOne(id: string): Promise<Dispenser> {
    const dispenser = await this.dispenserModel.findById(id).exec();
    if (!dispenser) {
      throw new NotFoundException(`Dispenser with ID ${id} not found`);
    }
    return dispenser;
  }

  async update(
    id: string,
    updateDispenserDto: UpdateDispenserDto,
  ): Promise<Dispenser> {
    const updatedDispenser = await this.dispenserModel
      .findByIdAndUpdate(id, updateDispenserDto, { new: true })
      .exec();
    if (!updatedDispenser) {
      throw new NotFoundException(`Dispenser with ID ${id} not found`);
    }
    return updatedDispenser;
  }

  async remove(id: string): Promise<Dispenser> {
    const deletedDispenser = await this.dispenserModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedDispenser) {
      throw new NotFoundException(`Dispenser with ID ${id} not found`);
    }
    return deletedDispenser;
  }

  async findByCode(code: string): Promise<Dispenser> {
    const dispenser = await this.dispenserModel.findOne({ code }).exec();
    if (!dispenser) {
      throw new NotFoundException(`Dispenser with code ${code} not found`);
    }
    return dispenser;
  }
}
