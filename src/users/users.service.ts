import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(@InjectModel('User') private readonly userModel : Model<IUser>,
              private jwtService: JwtService){
  }
  async create(createUserDto: CreateUserDto): Promise<Partial<IUser>>{
    const found_user = await this.userModel.findOne({$or:[{email: createUserDto.email},{cin:createUserDto.cin}]});
    if (found_user){
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await new this.userModel(createUserDto);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    return await user.save();
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

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({email: loginUserDto.email});
    if(!user) {
      throw new NotFoundException('wrong email or password');
    }
    if(await bcrypt.compare(loginUserDto.password, user.password)) {
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role
      }
      return this.jwtService.sign(payload)
    }
    throw new NotFoundException('wrong email or password');
  }
}
