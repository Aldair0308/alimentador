import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

// DTO para crear una nueva mascota
export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  raza: string;

  @IsNotEmpty()
  @IsEnum(['pequeño', 'mediano', 'grande'])
  categoria: string;

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
  @IsString({ each: true }) // Valida que cada elemento del arreglo sea un string
  horas: string[];

  @IsNotEmpty()
  @IsString()
  sexo: string;

  @IsNotEmpty()
  @IsString() // Cambiado a IsString, ya que el tipo de nacimiento es Date
  nacimiento: string; // Puedes usar un string ISO para la fecha
}
