import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
} from 'class-validator';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsEnum(['pequeño', 'mediano', 'grande'])
  tamaño?: string;

  @IsOptional()
  @IsNumber()
  gramos?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Valida que cada elemento del arreglo sea un string
  horas?: string[];
}
