import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Breed, BreedDocument } from './schema/breed.schema';
import { CreateBreedDto } from './dto/create-breed.dto'; // Asegúrate de crear este DTO
import { UpdateBreedDto } from './dto/update-breed.dto'; // Asegúrate de crear este DTO

@Injectable()
export class BreedsService {
  constructor(
    @InjectModel(Breed.name) private breedModel: Model<BreedDocument>,
  ) {}

  async create(createBreedDto: CreateBreedDto): Promise<Breed> {
    const newBreed = new this.breedModel(createBreedDto);
    return newBreed.save();
  }

  async findAll(): Promise<Breed[]> {
    return this.breedModel.find().exec();
  }

  async findById(id: string): Promise<Breed> {
    const breed = await this.breedModel.findById(id).exec();
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }
    return breed;
  }

  async update(id: string, updateBreedDto: UpdateBreedDto): Promise<Breed> {
    const updatedBreed = await this.breedModel
      .findByIdAndUpdate(id, updateBreedDto, { new: true })
      .exec();
    if (!updatedBreed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }
    return updatedBreed;
  }

  async delete(id: string): Promise<Breed> {
    const deletedBreed = await this.breedModel.findByIdAndDelete(id).exec();
    if (!deletedBreed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }
    return deletedBreed;
  }
}
