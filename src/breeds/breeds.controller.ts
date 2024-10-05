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
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './schema/breed.schema';

@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  async create(@Body() createBreedDto: CreateBreedDto): Promise<Breed> {
    return this.breedsService.create(createBreedDto);
  }

  @Get()
  async findAll(): Promise<Breed[]> {
    return this.breedsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Breed> {
    const breed = await this.breedsService.findById(id);
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }
    return breed;
  }

  @Get('category/:categoria') // Nueva ruta para obtener razas por categoría
  async findByCategory(
    @Param('categoria') categoria: string,
  ): Promise<Breed[]> {
    const breeds = await this.breedsService.findByCategory(categoria);
    if (!breeds || breeds.length === 0) {
      throw new NotFoundException(`No breeds found for category ${categoria}`);
    }
    return breeds;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBreedDto: UpdateBreedDto,
  ): Promise<Breed> {
    const updatedBreed = await this.breedsService.update(id, updateBreedDto);
    if (!updatedBreed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }
    return updatedBreed;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Breed> {
    const deletedBreed = await this.breedsService.delete(id);
    if (!deletedBreed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }
    return deletedBreed;
  }
}
