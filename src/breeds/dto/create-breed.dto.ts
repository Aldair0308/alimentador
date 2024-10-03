import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateBreedDto {
  @IsNotEmpty()
  @IsString()
  raza: string;

  @IsNotEmpty()
  @IsEnum(['pequeño', 'mediano', 'grande'])
  categoria: string;

  @IsNotEmpty()
  @IsString()
  tamaño: string;

  @IsNotEmpty()
  @IsString()
  vida: string;

  @IsNotEmpty()
  @IsString()
  peso: string;

  @IsNotEmpty()
  @IsNumber()
  gramos: number;

  @IsNotEmpty()
  @IsNumber()
  veces: number;

  @IsNotEmpty()
  @IsNumber()
  porcion: number;

  @IsArray()
  @IsString({ each: true })
  horas: string[];

  @IsNotEmpty()
  @IsString()
  sexo: string;

  @IsNotEmpty()
  @IsString()
  info: string;

  @IsOptional() // Este campo es opcional
  @IsString()
  foto?: string; // Campo para la URL de la foto
}
