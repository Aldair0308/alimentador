// update-user.dto.ts
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  rol?: string;

  @IsOptional()
  createdAt?: Date; // Esto no debería actualizarse generalmente, pero lo incluyo por si acaso

  @IsOptional()
  updatedAt?: Date; // Esto puede actualizarse manualmente si es necesario
}
