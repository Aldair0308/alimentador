import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from './schema/pet.schema';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const newPet = new this.petModel(createPetDto);
    return newPet.save();
  }

  async findAll(): Promise<Pet[]> {
    return this.petModel.find().exec();
  }

  async findById(id: string): Promise<Pet> {
    const pet = await this.petModel.findById(id).exec();
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  async findByCode(code: string): Promise<Pet> {
    const pet = await this.petModel.findOne({ code }).exec();
    if (!pet) {
      throw new NotFoundException(`Pet with code ${code} not found`);
    }
    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet> {
    const updatedPet = await this.petModel
      .findByIdAndUpdate(id, updatePetDto, { new: true })
      .exec();
    if (!updatedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return updatedPet;
  }

  async delete(id: string): Promise<Pet> {
    const deletedPet = await this.petModel.findByIdAndDelete(id).exec();
    if (!deletedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return deletedPet;
  }

  async findLastByCode(code: string): Promise<Pet> {
    const lastPet = await this.petModel
      .findOne({ code })
      .sort({ _id: -1 }) // Ordena por _id en orden descendente
      .exec();
    if (!lastPet) {
      throw new NotFoundException(`No pets found for code ${code}`);
    }
    return lastPet;
  }

  // Obtener códigos únicos y agrupar las horas
  async getCodesAndHoras(): Promise<{ code: string; horas: string[] }[]> {
    const pets = await this.petModel.find().select('code horas -_id').exec();
    const codeMap = new Map<string, string[]>();

    pets.forEach((pet) => {
      if (codeMap.has(pet.code)) {
        // Si el código ya existe, agregamos las horas y eliminamos duplicados
        const existingHoras = codeMap.get(pet.code);
        const combinedHoras = [...existingHoras, ...pet.horas];
        codeMap.set(pet.code, Array.from(new Set(combinedHoras)));
      } else {
        // Si el código no existe, lo añadimos
        codeMap.set(pet.code, pet.horas);
      }
    });

    // Convertimos el Map a un array de objetos
    const result = Array.from(codeMap.entries()).map(([code, horas]) => ({
      code,
      horas,
    }));

    return result;
  }
}
