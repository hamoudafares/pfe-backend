import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { ISession } from './interfaces/session.interface';

@Injectable()
export class SessionService {
  constructor(@InjectModel('Session') private readonly sessionModel : Model<ISession>){

  }
  async create(createsessionDto: CreateSessionDto): Promise<Partial<ISession>>{
    const session = await new this.sessionModel(createsessionDto);
    return  await session.save();
  }

  findAll() : Promise<Partial<ISession[]>>{
    const sessions = this.sessionModel.find().exec();

    return sessions ;
  }

  async findOne(id: string) : Promise<Partial<ISession>> {
    const session = await this.sessionModel.findOne({'_id' : id}).exec();
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
}
