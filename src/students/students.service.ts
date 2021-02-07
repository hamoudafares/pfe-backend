import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {StudentInterface} from "./interfaces/student.interface";
import {CreateStudentDto} from './dto/create-student.dto';
import {UpdateStudentDto} from './dto/update-student.dto';
import {DeletedStudentsService} from "./deleted-students.service";
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TeachersService } from '../teachers/teachers.service';
import { Request, Response } from 'express';

@Injectable()
export class StudentsService {
  constructor(@InjectModel('Student') private readonly studentModel: Model<StudentInterface>,
              private deletedStudentService: DeletedStudentsService,
              private usersService: UsersService,
              private teachersService: TeachersService) {}

  async create(createStudentDto: Partial<CreateStudentDto>, image: any, req: Request): Promise<any> {
    const user: Partial<CreateUserDto> = {
      familyName: createStudentDto.familyName,
      firstName: createStudentDto.firstName,
      cin: createStudentDto.cin,
      email: createStudentDto.email,
      password: createStudentDto.password,
      role: createStudentDto.role
    };
    let imagePath = req.protocol + '://' +req.get('host');
    //check if there's a file uploaded
    if (image) {
      imagePath = imagePath + '/uploads/' + image['originalname']
      user.image = imagePath;
    } else {
      console.log('no image uploaded')
    }
    if (createStudentDto.sex)
        user.sex = createStudentDto.sex ;
    if (createStudentDto.linkedInLink)
        user.linkedInLink = createStudentDto.linkedInLink;
    const registeredUser = await this.usersService.create(user);
    await registeredUser.save();
    if (!registeredUser) {
      throw new InternalServerErrorException(500, 'Could not create the user')
    }

    const studentToRegister = {
      _id: registeredUser._id,
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
  async getStudentsForSupervisor(teacherID : string): Promise<StudentInterface[]> {
    const students = await this.studentModel.find().where('supervisor').populate('user').populate('supervisor').exec();
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

  async addSupervisor(id: string, teacherCredentials: any) {
    const teacher = await this.teachersService.findOne(teacherCredentials.teacherId);
    if (!teacher) {
      throw new HttpException('teacher not found', 404)
    }
    const student = await this.studentModel.findByIdAndUpdate(id, {supervisor: teacher.id}, {new: true}).exec();
    if(!student) {
      throw new HttpException('student not found', 404);
    }
    return student
  }

  async removeSupervisor(id: string) {
    const student = await this.studentModel.findByIdAndUpdate(id, {supervisor: null}, {new: true}).exec();
    if(!student) {
      throw new HttpException('student not found', 404);
    }
    return student
  }

  async update(id: string, updateStudentDto: UpdateStudentDto, image: any, req: Request) {
    const studentToUpdate = await this.studentModel.findById(id).populate("user").exec();
    let imagePath = req.protocol + '://' +req.get('host');
    //check if there's a file uploaded
    if (image) {
      imagePath = imagePath + '/uploads/' + image['originalname']
      updateStudentDto.image = imagePath;
    } else {
      console.log('no image uploaded')
    }
    const user = this.usersService.update(studentToUpdate.user['_id'], updateStudentDto);
    const student = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, {new: true}).exec();
    if(!student) {
      throw new HttpException('student not found', 404);
    }
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

  async addPfe(id: string, file: any, pfe: any, req: Request) {
    let doc = req.protocol + '://' +req.get('host');
    //check if there's a file uploaded
    if (file) {
      doc = doc + '/uploads/' + file['originalname']
      pfe.rapport = doc;
    } else {
      console.log('no files uploaded')
    }
    const student = await this.studentModel.findByIdAndUpdate(id, {pfe: pfe}, {new: true}).exec();
    if(!student) {
      throw new HttpException('student not found', 404);
    }
    return student
  }

  async updatePfe(id: string, file: any, pfe: any, req: Request) {
    const edits = {};
    let doc = req.protocol + '://' +req.get('host');
    //check if there's a file uploaded
    if (file) {
      doc = doc + '/uploads/' + file['originalname']
      edits['pfe.rapport'] = doc
    } else {
      console.log('no files uploaded')
    }
    for (const key in pfe) {
      console.log(key + ' ' + pfe[key]);
      edits['pfe.'+key] = pfe[key];
    }
    const student = await this.studentModel.findByIdAndUpdate(id, {$set: edits}, {new: true}).exec();
    if(!student) {
      throw new HttpException('student not found', 404);
    }
    return student
  }

  async deletePfe(id: string) {
    const student = await this.studentModel.findByIdAndUpdate(id, {pfe: null}, {new: true}).exec();
    if(!student) {
      throw new HttpException('student not found', 404);
    }
    return student
  }

  async getRapport(image: string, res: Response) {
    const response = await res.sendFile(image, { root: './uploads' });
    return {
      status: HttpStatus.OK,
      data: response,
    };
  }

  async validatePfe(id: string) {
    const edits = {}
    edits['pfe.valid'] = true
    const student = await this.studentModel.findByIdAndUpdate(id, {$set: edits}, {new: true}).exec();
    if(!student) {
      throw new HttpException('student not found', 404);
    }
    return student
  }
}
