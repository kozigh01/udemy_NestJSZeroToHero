import { InputType, Field, ID } from "@nestjs/graphql";
import { MinLength, IsDateString, IsUUID } from 'class-validator';

@InputType()
export class CreateLessonInput {
  @Field()
  @MinLength(1)
  name: string;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;

  @Field(type => [ID], { defaultValue: [], nullable: true })
  @IsUUID('4', { each: true })
  students: string[];
}