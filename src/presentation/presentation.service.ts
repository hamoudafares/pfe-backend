import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IPresentation } from './interfaces/presentation.interface';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
@Injectable()
export class PresentationService {
  constructor(@InjectModel('Presentation') private readonly presentationModel : Model<IPresentation>){
  }
  async create(createpresentationDto: CreatePresentationDto): Promise<Partial<IPresentation>>{
    const presentation = await new this.presentationModel(createpresentationDto);
     return  await presentation.save();
  }

  findAll() : Promise<Partial<IPresentation[]>>{
    const presentations = this.presentationModel.find().exec();

    return presentations ;
  }

  async findOne(id: string) : Promise<Partial<IPresentation>> {
    const presentation = await this.presentationModel.findOne({'_id' : id}).exec();
    if (!presentation){
      throw new HttpException("Not Found", 404);
    }
    return presentation ;
  }

  async remove(id: string) : Promise<boolean> {
    const presentation = await this.presentationModel.remove({ '_id' : id }).exec();
    if (presentation.deletedCount === 0) {
      throw new HttpException('Not Found', 404);
    }else {
      return true ;
    }
  }

  public async putpresentationById(
    id: string ,
    query ,
  ): Promise<Partial<IPresentation>> {
    const presentation = await this.presentationModel
      .findOneAndUpdate(
        { _id : id },
        query, { new  : true , useFindAndModify : false})
      .exec();
    if (!presentation) {
      throw new HttpException('Not Found', 404);
    }
    return await presentation.save();
  }

  async update(id: string, newpresentation: UpdatePresentationDto): Promise<Partial<IPresentation>> {
    const presentation = await this.presentationModel.findOneAndUpdate ({
        _id: id
      },{
        ...newpresentation
      },
      { new  : true , useFindAndModify : false});
    if (!presentation) {
      new NotFoundException(`Le todo d'id ${id} n'existe pas`);
    }
    return await presentation.save();
  }
}
