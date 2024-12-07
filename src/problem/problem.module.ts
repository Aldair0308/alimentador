import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { Problem, ProblemSchema } from './schema/problem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Problem.name, schema: ProblemSchema }]),
  ],
  controllers: [ProblemController],
  providers: [ProblemService],
})
export class ProblemModule {}
