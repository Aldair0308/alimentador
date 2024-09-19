import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  raza: string;

  @IsNotEmpty()
  @IsEnum(['pequeño', 'mediano', 'grande'])
  tamaño: string;

  @IsNotEmpty()
  @IsNumber()
  gramos: number;

  @IsArray()
  @IsString({ each: true }) // Valida que cada elemento del arreglo sea un string
  horas: string[];
}
