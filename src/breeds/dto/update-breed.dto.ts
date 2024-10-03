import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  IsArray,
} from 'class-validator';

export class UpdateBreedDto {
  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsEnum(['pequeño', 'mediano', 'grande'])
  categoria?: string;

  @IsOptional()
  @IsString()
  tamaño?: string;

  @IsOptional()
  @IsString()
  vida?: string;

  @IsOptional()
  @IsString()
  peso?: string;

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
  @IsString({ each: true })
  horas?: string[];

  @IsOptional()
  @IsString()
  sexo?: string;

  @IsOptional()
  @IsString()
  info?: string;

  @IsOptional() // Este campo es opcional
  @IsString()
  foto?: string; // Campo para la URL de la foto
}
