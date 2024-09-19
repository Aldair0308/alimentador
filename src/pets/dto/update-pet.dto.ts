import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';

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
  @IsString() // Puedes usar validaciones adicionales para el formato de hora
  hora?: string;
}
