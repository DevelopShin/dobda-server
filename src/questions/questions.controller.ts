import { Body, Controller, Post } from '@nestjs/common';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { CreateTagsDto } from './dtos/create-tags.dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async createQuestion(
    @Body('question') createQuestionDto: CreateQuestionDto,
    @Body('tag') createTagsDto: CreateTagsDto,
  ) {
    return this.questionsService.createQuestion(
      createQuestionDto,
      createTagsDto,
    );
  }
}
