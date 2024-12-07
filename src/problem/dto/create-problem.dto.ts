import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  problema: string;

  @IsEnum(['pendiente', 'en revision', 'resuelto'], {
    message: 'Estado inválido',
  })
  estado: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  categoria: string;

  // No incluimos la fecha aquí, ya que será gestionada por el esquema automáticamente.

  @IsString()
  responsable: string;
}
