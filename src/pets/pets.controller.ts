import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './schema/pet.schema';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  async create(@Body() createPetDto: CreatePetDto): Promise<Pet> {
    return this.petsService.create(createPetDto);
  }

  @Get()
  async findAll(): Promise<Pet[]> {
    return this.petsService.findAll();
  }

  @Get('last/:code') // Esta línea debe estar antes de la ruta con :id
  async findLastByCode(@Param('code') code: string): Promise<Pet> {
    return this.petsService.findLastByCode(code);
  }
  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<Pet> {
    const pet = await this.petsService.findByCode(code);
    if (!pet) {
      throw new NotFoundException(`Pet with code ${code} not found`);
    }
    return pet;
  }

  @Get('codes') // Asegúrate de que esta ruta esté antes que @Get(':id')
  async getCodesAndHoras(): Promise<{ code: string; horas: string[] }[]> {
    return this.petsService.getCodesAndHoras();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pet> {
    const pet = await this.petsService.findById(id);
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
  ): Promise<Pet> {
    const updatedPet = await this.petsService.update(id, updatePetDto);
    if (!updatedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return updatedPet;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pet> {
    const deletedPet = await this.petsService.delete(id);
    if (!deletedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return deletedPet;
  }
}
