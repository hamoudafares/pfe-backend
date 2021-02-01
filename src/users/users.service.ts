import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import {IUser} from "./interfaces/user.interface";
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {

  constructor(@InjectModel('User') private readonly userModel : Model<IUser> , @InjectConnection() private connection: Connection){
  }
  async create(createUserDto: CreateUserDto ): Promise<Partial<IUser>>{
    const found_user = await this.userModel.findOne({'email' : createUserDto.email , 'cin' : createUserDto.cin });
    if (found_user ){
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await new this.userModel(createUserDto);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    return await user.save();

  }

  async createMultipleUsers(createUsersDto: [CreateUserDto]): Promise<boolean>{

    const session = await this.connection.startSession();
    session.startTransaction();
    for (const createUserDto of createUsersDto){

      const found_user = await this.userModel.findOne({'email' : createUserDto.email , 'cin' : createUserDto.cin }).session(session);
      if (found_user ){
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const user =  new this.userModel(createUserDto);
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, user.salt);
      await user.save();
    }
    session.endSession();
    return true
  }
  findAll() : Promise<Partial<IUser[]>>{
    const users = this.userModel.find().exec();
    return users ;
  }

  async findOne(id: string) : Promise<Partial<IUser>> {
    const user = await this.userModel.findOne({'_id' : id}).exec();
    if (!user){
      throw new HttpException("Not Found", 404);
    }
    return user ;
  }

  async remove(id: string) : Promise<boolean> {
    const user = await this.userModel.remove({ '_id' : id }).exec();
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
      throw new NotFoundException(`the user with id ${id} dosen't exit`);
    }
    return await user.save();
  }
  async changepassword(id: string, changePasswordDto: ChangePasswordDto): Promise<Partial<IUser>> {
    const user = await this.userModel.findOne ({
      _id: id
    });
    if (!user) {
      throw new NotFoundException(`the user with id ${id} dosen't exit`);
    }
    if ( await bcrypt.compare(changePasswordDto.oldPassword, user.password))
     {
       user.password = await bcrypt.hash(changePasswordDto.newPassword, user.salt);
     }
    else
      {
        throw new HttpException('Old password entered is not correct', 404);
      }
    return await user.save();
  }
}
