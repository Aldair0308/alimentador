import { PartialType } from '@nestjs/mapped-types';
import { CreateDistanceDto } from './create-distance.dto';

export class UpdateDistanceDto extends PartialType(CreateDistanceDto) {}
