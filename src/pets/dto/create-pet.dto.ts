import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsString() // Puedes usar validaciones adicionales para el formato de hora
  hora: string;
}
