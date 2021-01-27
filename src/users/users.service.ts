import {ConflictException, HttpException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {IUser} from "./interfaces/user.interface";
import * as bcrypt from 'bcrypt';
import {query} from "express";

@Injectable()
export class UsersService {

  constructor(@InjectModel('User') private readonly userModel : Model<IUser>){
  }
  async create(createUserDto: CreateUserDto): Promise<Partial<IUser>>{
    const user = await new this.userModel(createUserDto);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try{
      await user.save();
    } catch (e) {
      console.log(e);
      throw new ConflictException(`username ou email redondant. Ils doivent être unique`);
    }
    return  {
      id: user._id,
      email: user.email,
      role: user.role
    };
  }

  findAll() : Promise<Partial<IUser[]>>{
    const users = this.userModel.find().exec();
    return users ;
  }

  findOne(id: string) : Promise<Partial<IUser>> {
    const user = this.userModel.findOne({'_id' : id}).exec();
    if (!user){
      throw new HttpException("Not Found", 404);
    }
    return user ;
  }

  async remove(id: string) : Promise<boolean> {
    const user = await this.userModel.remove({ '_id' : id }).exec();
    console.log(user)
    if (user.deletedCount === 0) {
      throw new HttpException('Not Found', 404);
    }else {
      return true ;
    }
  }

  public async putUserById(
      id: string ,
      query ,
  ): Promise<Partial<IUser>> {
    const user = await this.userModel
        .findOneAndUpdate(
            { _id : id },
            query, { new  : true , useFindAndModify : false})
        .exec();
    if (!user) {
      throw new HttpException('Not Found', 404);
    }
    return await user.save();
  }

  async update(id: string, newUser: UpdateUserDto): Promise<Partial<IUser>> {
    const user = await this.userModel.findOneAndUpdate ({
      _id: id
    },{
      ...newUser
    },
        { new  : true , useFindAndModify : false});
    if (!user) {
      new NotFoundException(`Le todo d'id ${id} n'existe pas`);
    }
    return await user.save();
  }
}
