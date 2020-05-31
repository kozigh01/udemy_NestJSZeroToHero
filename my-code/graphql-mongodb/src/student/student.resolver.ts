import { StudentType } from "./student.type";
import { Resolver, Mutation, Args, Query, ResolveField, Parent } from "@nestjs/graphql";
import { StudentService } from "./student.service";
import { Student } from "./student.entity";
import { CreateStudentInput } from "./student.input";


@Resolver(of => StudentType)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Query(returns => StudentType)
  getStudentById(@Args('id') id: string): Promise<Student> {
    return this.studentService.getStudentById(id);
  }

  @Query(returns => [StudentType])
  getStudents(): Promise<Student[]> {
    return this.studentService.getStudents();
  }

  @Mutation(returns => StudentType)
  async createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput
  ): Promise<Student> {
    return this.studentService.createStudent(createStudentInput);
  }
}