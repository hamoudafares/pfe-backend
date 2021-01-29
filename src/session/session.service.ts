import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { ISession } from './interfaces/session.interface';
import { AddPresidentDto } from '../presentation/dto/add-president.dto';
import { TeachersService } from '../teachers/teachers.service';

@Injectable()
export class SessionService {
  constructor(@InjectModel('Session') private readonly sessionModel : Model<ISession>, private teachersService : TeachersService){

  }
  async create(createsessionDto: CreateSessionDto): Promise<Partial<ISession>>{
    const session = await new this.sessionModel(createsessionDto);
    return  await session.save();
  }

  findAll() : Promise<Partial<ISession[]>>{
    const sessions = this.sessionModel.find().populate({
      path: "president",
      populate: {
        path: "user",
        select: '-password -salt -role'
      }
    }).exec();

    return sessions ;
  }

  async findOne(id: string) : Promise<Partial<ISession>> {
    const session = await this.sessionModel.findOne({'_id' : id}).populate({
      path: "president",
      populate: {
        path: "user",
        select: '-password -salt -role'
      }
    }).exec();
    if (!session){
      throw new HttpException("Not Found", 404);
    }
    return session ;
  }

  async remove(id: string) : Promise<boolean> {
    const session = await this.sessionModel.remove({ '_id' : id }).exec();
    if (session.deletedCount === 0) {
      throw new HttpException('Not Found', 404);
    }else {
      return true ;
    }
  }

  public async putsessionById(
    id: string ,
    query ,
  ): Promise<Partial<ISession>> {
    const session = await this.sessionModel
      .findOneAndUpdate(
        { _id : id },
        query, { new  : true , useFindAndModify : false})
      .exec();
    if (!session) {
      throw new HttpException('Not Found', 404);
    }
    return await session.save();
  }

  async update(id: string, newsession: UpdateSessionDto): Promise<Partial<ISession>> {
    const session = await this.sessionModel.findOneAndUpdate ({
        _id: id
      },{
        ...newsession
      },
      { new  : true , useFindAndModify : false});
    if (!session) {
      new NotFoundException(`Le todo d'id ${id} n'existe pas`);
    }
    return await session.save();
  }

  async addPresident(id: string, addPresidentDto : AddPresidentDto) {
    const teacher = await this.teachersService.findOne(addPresidentDto.teacherID);
    if (!teacher) {
      throw new HttpException('teacher not found', 404)
    }
    const presentation = await this.sessionModel.findByIdAndUpdate(id, {president: teacher.id}, {new: true}).exec();
    if(!presentation) {
      throw new HttpException('Session not found', 404);
    }
    return presentation
  }

  async removePresident(id: string) {
    const presentation = await this.sessionModel.findByIdAndUpdate(id, {president: null}, {new: true , useFindAndModify : false}).exec();
    if(!presentation) {
      throw new HttpException('Session not found', 404);
    }
    return presentation
  }
}
