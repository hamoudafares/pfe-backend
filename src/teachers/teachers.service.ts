import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherInterface } from './interfaces/teacher.interface';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class TeachersService {
  constructor(@InjectModel('Teacher') private readonly teacherModel: Model<TeacherInterface>,
              private usersService: UsersService) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<any> {
    const user: CreateUserDto = {
      familyName: createTeacherDto.familyName,
      firstName: createTeacherDto.firstName,
      cin: createTeacherDto.cin,
      email: createTeacherDto.email,
      password: createTeacherDto.password,
      role: createTeacherDto.role
    }
    const registeredUser = await this.usersService.create(user);
    if (!registeredUser) {
      throw new InternalServerErrorException(500, 'Could not create the user')
    }
    const teacherToRegister = {
      speciality: createTeacherDto.speciality,
      annee: createTeacherDto.annee,
      user: registeredUser.id
    }
    const teacher = await new this.teacherModel(teacherToRegister);
    const createdTeacher = teacher.save();
    return {
      id: teacher._id,
      speciality: teacher.speciality,
      annee: teacher.annee,
      email: teacher.user['email'],
      firstName: teacher.user['firstName'],
      familyName: teacher.user['familyName']
    };
  }

  async findAll(): Promise<any[]> {
    const teachers = await this.teacherModel.find().populate('user').exec();
    if (!teachers) {
      throw new HttpException('No Teachers Found', 404);
    }
    let teachersToReturn = [];
    teachers.forEach(teacher => {
      teachersToReturn.push({
        id: teacher._id,
        speciality: teacher.speciality,
        annee: teacher.annee,
        email: teacher.user['email'],
        firstName: teacher.user['firstName'],
        familyName: teacher.user['familyName']
      });
    });
    return teachersToReturn;
  }

  async findOne(id: string): Promise<any> {
    //verify the id is a mongoose id
    const teacher = await this.teacherModel.findById(id).populate('user').exec();
    if (!teacher) {
      throw new HttpException('teacher not found', 404);
    }
    return {
      id: teacher._id,
      speciality: teacher.speciality,
      annee: teacher.annee,
      email: teacher.user['email'],
      firstName: teacher.user['firstName'],
      familyName: teacher.user['familyName']
    };
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teacherModel.findByIdAndUpdate(id, updateTeacherDto).exec();
    if(!teacher) {
      throw new HttpException('teacher not found', 404);
    }
    // this is the value of the old teacher before the update
    return {
      id: teacher._id,
      speciality: teacher.speciality,
      annee: teacher.annee,
      email: teacher.user['email'],
      firstName: teacher.user['firstName'],
      familyName: teacher.user['familyName']
    }
  }

  async remove(id: string) {
    const teacher = await this.teacherModel.findByIdAndDelete(id)
    if (!teacher){
      throw new HttpException('teacher not found', 404);
    }
    // return await this.deletedStudentService.create(student);
    return {
      id: teacher._id,
      speciality: teacher.speciality,
      annee: teacher.annee,
      email: teacher.user['email'],
      firstName: teacher.user['firstName'],
      familyName: teacher.user['familyName']
    }
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
