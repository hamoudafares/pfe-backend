import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { IPresentation } from './interfaces/presentation.interface';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { TeachersService } from '../teachers/teachers.service';
import { AddPresidentDto } from './dto/add-president.dto';
import { SetSessionDto } from './dto/set-session.dto';
import { SessionService } from '../session/session.service';
import { StudentsService } from '../students/students.service';
import { SetStudentDto } from './dto/set-student.dto';
import { SetJuryDto } from './dto/set-jury.dto';
import { FindPresentationPerTeacherPerYearDto } from './dto/findPresentationPerTeacherPerYear.dto';

@Injectable()
export class PresentationService {
  constructor(@InjectModel('Presentation') private readonly presentationModel: Model<IPresentation>,
              private teachersService: TeachersService,
              private sessionService: SessionService,
              private studentsService: StudentsService) {
  }

  async create(createpresentationDto: CreatePresentationDto): Promise<Partial<IPresentation>> {
    const presentation = await new this.presentationModel(createpresentationDto);
    return await presentation.save();
  }

  async findPresentationsPerTeacherPerYear(findPresentationPerTeacherPerYearDto: FindPresentationPerTeacherPerYearDto): Promise<Array<IPresentation>> {

    // const studentsforteacher = await this.studentsService.getStudentsForSupervisor(findPresentationPerTeacherPerYearDto.teacherID);

    const presentations = await this.presentationModel
      .find()
      .populate({
        path: 'president',
        populate: {
          path: 'user',
          select: '-password -salt -role',
        },
      }).populate({
        path: 'student',
        populate: {
          path: 'user',
          select: '-password -salt -role',
        },
      }).populate({
        path: 'student',
        populate: {
          path: 'supervisor',
          populate: {
            path: 'user',
            select: '-password -salt -role',
          },
        },
      }).populate({
          path: 'session',
          // match : {anneeUniversitaire : {$in : ["201"]}},
          populate: {
            path: 'president',
            populate: {
              path: 'user',
              select: '-password -salt -role',
            },
          },
        },
      )
      .populate({
        path: 'jury',
        populate: {
          path: 'user',
          select: '-password -salt -role',
        },
      }).exec();
    const ObjectId = mongoose.Types.ObjectId;

    const final = this.presentationModel.aggregate([
      {
        $lookup: {
          from: 'sessions',
          localField: 'session',
          foreignField: '_id',
          as: 'session',
        },
      },
      { $unwind: '$session' },

      {
        $lookup: {
          from: 'teachers',
          localField: 'session.president',
          foreignField: '_id',
          as: 'session.president',
        },
      },
      { $unwind: '$session.president' },
      {
        $lookup: {
          from: 'users',
          localField: 'session.president.user',
          foreignField: '_id',
          as: 'session.president.user',
        },
      },
      { $project: { 'session.president.user.password': 0, 'session.president.user.salt': 0 } },

      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'users',
          localField: 'student.user',
          foreignField: '_id',
          as: 'student.user',
        },
      },
      { $project: { 'student.user.password': 0, 'student.user.salt': 0 } },
      {
        $lookup: {
          from: 'teachers',
          localField: 'jury',
          foreignField: '_id',
          as: 'jury',
        },
      },
      {
        '$lookup': {
          'from': 'users',
          'let': {
            jury: '$jury',
          },
          'pipeline': [
            {
              $match: {
                $expr: {
                  $in: [
                    '$_id',
                    '$$jury.user',
                  ],
                },
              },
            },
            {
              $project:
                {
                  password: 0,
                  salt: 0,
                },
            },
          ]
          ,
          'as': 'jury',
        },
      }
      ,
      {
        $match: {
          'session.anneeUniversitaire': '202',
          'student.supervisor': ObjectId('6011329dc41e2a18e4a462b5'),
        },
      }],
    );
    return final;
  }


  async findAll(): Promise<Partial<IPresentation[]>> {
    const presentations = await this.presentationModel.find().populate({
      path: 'president',
      populate: {
        path: 'user',
        select: '-password -salt -role',
      },
    }).populate({
      path: 'student',
      populate: {
        path: 'user',
        select: '-password -salt -role',
      },
    }).populate({
      path: 'student',
      populate: {
        path: 'supervisor',
        populate: {
          path: 'user',
          select: '-password -salt -role',
        },
      },
    }).populate({
      path: 'session',
      populate: {
        path: 'president',
        populate: {
          path: 'user',
          select: '-password -salt -role',
        },
      },
    }).populate({
      path: 'jury',
      populate: {
        path: 'user',
        select: '-password -salt -role',
      },
    }).exec();

    return presentations;
  }

  async findOne(id: string): Promise<Partial<IPresentation>> {
    const presentation = await this.presentationModel.findOne({ '_id': id }).populate({
      path: 'president',
      populate: {
        path: 'user',
        select: '-password -salt -role',
      },
    }).populate({
      path: 'student',
      populate: {
        path: 'user',
        select: '-password -salt -role',
      },
    }).populate({
      path: 'jury',
      populate: {
        path: 'user',
        select: '-password -salt -role',
      },
    }).populate({
      path: 'student',
      populate: {
        path: 'supervisor',
        populate: {
          path: 'user',
          select: '-password -salt -role',
        },
      },
    }).populate({
      path: 'session',
      populate: {
        path: 'president',
        populate: {
          path: 'user',
          select: '-password -salt -role',
        },
      },
    }).exec();
    if (!presentation) {
      throw new HttpException('Not Found', 404);
    }
    return presentation;
  }

  async remove(id: string): Promise<boolean> {
    const presentation = await this.presentationModel.remove({ '_id': id }).exec();
    if (presentation.deletedCount === 0) {
      throw new HttpException('Not Found', 404);
    } else {
      return true;
    }
  }

  public async putpresentationById(
    id: string,
    query,
  ): Promise<Partial<IPresentation>> {
    const presentation = await this.presentationModel
      .findOneAndUpdate(
        { _id: id },
        query, { new: true, useFindAndModify: false })
      .exec();
    if (!presentation) {
      throw new HttpException('Not Found', 404);
    }
    return await presentation.save();
  }

  async update(id: string, newpresentation: UpdatePresentationDto): Promise<Partial<IPresentation>> {
    const presentation = await this.presentationModel.findOneAndUpdate({
        _id: id,
      }, {
        ...newpresentation,
      },
      { new: true, useFindAndModify: false });
    if (!presentation) {
      new NotFoundException(`Le todo d'id ${id} n'existe pas`);
    }
    return await presentation.save();
  }

  async addPresident(id: string, addPresidentDto: AddPresidentDto) {
    let teacher = null;
    if (addPresidentDto.teacherID.match(/^[0-9a-fA-F]{24}$/)) {
      teacher = await this.teachersService.findOne(addPresidentDto.teacherID);
    }

    if (!teacher) {
      throw new HttpException('teacher not found', 404);
    }
    let presentation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      presentation = await this.presentationModel.findByIdAndUpdate(id, { president: teacher.id }, { new: true }).exec();
    }
    if (!presentation) {
      throw new HttpException('Presentation not found', 404);
    }
    return presentation;
  }

  async removePresident(id: string) {
    let presentation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      presentation = await this.presentationModel.findByIdAndUpdate(id, { president: null }, {
        new: true,
        useFindAndModify: false,
      }).exec();
    }

    if (!presentation) {
      throw new HttpException('Presentation not found', 404);
    }
    return presentation;
  }

  async setSession(id: string, setSessionDto: SetSessionDto) {
    let session = null;
    if (setSessionDto.sessionID.match(/^[0-9a-fA-F]{24}$/)) {
      session = await this.sessionService.findOne(setSessionDto.sessionID);
    }

    if (!session) {
      throw new HttpException('Session not found', 404);
    }
    let presentation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      presentation = await this.presentationModel.findByIdAndUpdate(id, { session: session.id }, { new: true }).exec();
    }
    if (!presentation) {
      throw new HttpException('Presentation not found', 404);
    }
    return presentation;
  }

  async removeSession(id: string) {
    let presentation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      presentation = await this.presentationModel.findByIdAndUpdate(id, { session: null }, {
        new: true,
        useFindAndModify: false,
      }).exec();
    }
    if (!presentation) {
      throw new HttpException('Presentation not found', 404);
    }
    return presentation;
  }

  async setStudent(id: string, setStudentDto: SetStudentDto) {
    let student = null;
    if (setStudentDto.studentID.match(/^[0-9a-fA-F]{24}$/)) {
      student = await this.studentsService.findOne(setStudentDto.studentID);
    }
    if (!student) {
      throw new HttpException('Student not found', 404);
    }
    let presentation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      presentation = await this.presentationModel.findByIdAndUpdate(id, { student: student.id }, { new: true }).exec();
    }
    if (!presentation) {
      throw new HttpException('Presentation not found', 404);
    }
    return presentation;
  }

  async removeStudent(id: string) {
    let presentation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      presentation = await this.presentationModel.findByIdAndUpdate(id, { student: null }, {
        new: true,
        useFindAndModify: false,
      }).exec();
    }

    if (!presentation) {
      throw new HttpException('Presentation not found', 404);
    }
    return presentation;
  }

  async setJury(id: string, setJuryDto: SetJuryDto) {
    let session = null;
    setJuryDto.teacherIDs = this.uniq(setJuryDto.teacherIDs);
    for (const id of setJuryDto.teacherIDs) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        session = await this.teachersService.findOne(id);
      } else {
        session = null;
      }
      if (!session) {
        throw new HttpException(`teacher with id ${id} not found`, 404);
      }
    }
    let presentation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      presentation = await this.presentationModel.findByIdAndUpdate(id, { jury: setJuryDto.teacherIDs }, { new: true }).exec();
    }
    if (!presentation) {
      throw new HttpException('Presentation not found', 404);
    }
    return presentation;
  }

  async removeJuryMember(id: string, juryMemberID: string) {
    let presentation = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      presentation = await this.presentationModel.findById(id).exec();
    }
    if (!presentation) {
      throw new HttpException('Presentation not found', 404);
    }
    const jury = presentation.jury;
    if (jury.indexOf(juryMemberID) == -1) {
      throw new HttpException('JuryMember not found', 404);
    } else {
      jury.splice(jury.indexOf(juryMemberID), 1);
    }

    presentation.jury = jury;
    return await presentation.save();

  }

  private uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  }
}
