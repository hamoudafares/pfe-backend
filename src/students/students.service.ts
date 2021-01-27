import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {StudentInterface} from "./interfaces/student.interface";
import {CreateStudentDto} from './dto/create-student.dto';
import {UpdateStudentDto} from './dto/update-student.dto';
import {DeletedStudentsService} from "./deleted-students.service";
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TeachersService } from '../teachers/teachers.service';

@Injectable()
export class StudentsService {
  constructor(@InjectModel('Student') private readonly studentModel: Model<StudentInterface>,
              private deletedStudentService: DeletedStudentsService,
              private usersService: UsersService,
              private teachersService: TeachersService) {}

  async create(createStudentDto: CreateStudentDto): Promise<any> {
    const user: CreateUserDto = {
      familyName: createStudentDto.familyName,
      firstName: createStudentDto.firstName,
      cin: createStudentDto.cin,
      email: createStudentDto.email,
      password: createStudentDto.password,
      role: createStudentDto.role
    }
    const registeredUser = await this.usersService.create(user);
    if (!registeredUser) {
      throw new InternalServerErrorException(500, 'Could not create the user')
    }
    const studentToRegister = {
      studentNumber: createStudentDto.studentNumber,
      speciality: createStudentDto.speciality,
      option: createStudentDto.option,
      annee: createStudentDto.annee,
      user: registeredUser.id
    }
    const student = await new this.studentModel(studentToRegister);
    return student.save();
  }

  async findAll(): Promise<StudentInterface[]> {
    const students = await this.studentModel.find().populate('user').populate('supervisor').exec();
    if (!students) {
      throw new HttpException('No Students Found', 404);
    }
    return students;
  }

  async findOne(id: string): Promise<StudentInterface> {
    //verify the id is a mongoose id
    const student = await this.studentModel.findById(id).populate('user').populate('supervisor').exec();
    if (!student) {
      throw new HttpException('student not found', 404);
    }
    return student;
  }

  async addSupervisor(id: string, teacherId: any) {
    console.log(teacherId.teacherId);
    const teacher = await this.teachersService.findOne(teacherId.teacherId);
    if (!teacher) {
      throw new HttpException('teacher not found', 404)
    }
    const student = await this.studentModel.findByIdAndUpdate(id, {supervisor: teacher.id})
    if(!student) {
      throw new HttpException('student not found', 404);
    }
    // this is the value of the old student before the update
    return student
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

  /* async restore(id: string) {
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
  } */
}
