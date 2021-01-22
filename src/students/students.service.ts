import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {StudentInterface} from "./interfaces/student.interface";
import {CreateStudentDto} from './dto/create-student.dto';
import {UpdateStudentDto} from './dto/update-student.dto';
import {DeletedStudentInterface} from "./interfaces/deleted-student.interface";
import {DeletedStudentsService} from "./deleted-students.service";

@Injectable()
export class StudentsService {
  constructor(@InjectModel('Student') private readonly studentModel: Model<StudentInterface>,
              private deletedStudentService: DeletedStudentsService) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentInterface> {
    const student = await new this.studentModel(createStudentDto);
    return student.save();
  }

  async findAll(): Promise<StudentInterface[]> {
    const students = await this.studentModel.find().exec();
    if (!students) {
      throw new HttpException('No Students Found', 404);
    }
    return students;
  }

  async findOne(id: string): Promise<StudentInterface> {
    //verify the id is a mongoose id
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new HttpException('student not found', 404);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentModel.findByIdAndUpdate(id, updateStudentDto).exec();
    if(!student) {
      throw new HttpException('student not found', 404);
    }
    // this is the value of the old student before the update
    return student
  }

  async remove(id: string) {
    const student = await this.studentModel.findByIdAndDelete(id)
    if (!student){
      throw new HttpException('student not found', 404);
    }
    return await this.deletedStudentService.create(student);
  }

  async restore(id: string) {
    const deletedStudent = await this.deletedStudentService.findOneDeleted(id);
    if(!deletedStudent) {
      throw new NotFoundException(404,'could not recover student, never existed and never has been part of INSAT')
    }
    const student: CreateStudentDto = {
      studentNumber: deletedStudent.studentNumber,
      speciality: deletedStudent.speciality,
      option: deletedStudent.option,
      annee: deletedStudent.annee
    }
    return this.create(student);
  }
}
