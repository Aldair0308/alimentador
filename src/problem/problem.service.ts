import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Problem, ProblemDocument } from './schema/problem.schema';

@Injectable()
export class ProblemService {
  constructor(
    @InjectModel(Problem.name)
    private readonly problemModel: Model<ProblemDocument>,
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<Problem> {
    const createdProblem = new this.problemModel(createProblemDto);
    return createdProblem.save();
  }

  async findAll(): Promise<Problem[]> {
    return this.problemModel.find().exec();
  }

  async findOne(id: string): Promise<Problem> {
    const problem = await this.problemModel.findById(id).exec();
    if (!problem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
    return problem;
  }

  async update(
    id: string,
    updateProblemDto: UpdateProblemDto,
  ): Promise<Problem> {
    const updatedProblem = await this.problemModel
      .findByIdAndUpdate(id, updateProblemDto, { new: true })
      .exec();
    if (!updatedProblem) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
    return updatedProblem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.problemModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Problem with ID ${id} not found`);
    }
  }
}
