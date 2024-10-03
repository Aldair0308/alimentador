// DTO para actualizar una mascota
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  foto?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsEnum(['pequeño', 'mediano', 'grande'])
  categoria?: string;

  @IsOptional()
  @IsNumber()
  gramos?: number;

  @IsOptional()
  @IsNumber()
  veces?: number;

  @IsOptional()
  @IsNumber()
  porcion?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Valida que cada elemento del arreglo sea un string
  horas?: string[];

  @IsOptional()
  @IsString()
  sexo?: string;

  @IsOptional()
  @IsString() // Cambiado a IsString, ya que el tipo de nacimiento es Date
  nacimiento?: string; // Puedes usar un string ISO para la fecha
}
