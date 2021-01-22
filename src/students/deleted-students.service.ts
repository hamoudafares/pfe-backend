import {HttpException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {StudentInterface} from "./interfaces/student.interface";
import {CreateStudentDto} from './dto/create-student.dto';
import {UpdateStudentDto} from './dto/update-student.dto';
import {DeletedStudentInterface} from "./interfaces/deleted-student.interface";
import {DeleteStudentDto} from "./dto/delete-student.dto";

@Injectable()
export class DeletedStudentsService {
    constructor(@InjectModel('StudentsDeleted') private readonly studentDeletedModel: Model<DeletedStudentInterface>) {}

    async create(student: StudentInterface): Promise<any> {
        var deleteStudentDto: DeleteStudentDto = {
            studentNumber: student.studentNumber,
            speciality: student.speciality,
            option: student.option,
            _id: student.id,
            annee: student.annee
        }
        const studentDeleted = await new this.studentDeletedModel(deleteStudentDto);
        return studentDeleted.save();
    }

    async findAllDeleted(): Promise<DeletedStudentInterface[]> {
        const students = await this.studentDeletedModel.find().exec();
        if (!students) {
            throw new HttpException('No Students Found', 404);
        }
        return students;
    }

    async findOneDeleted(id: string): Promise<any> {
        //verify the id is a mongoose id
        const student = await this.studentDeletedModel.findById(id).exec();
        if (!student) {
            throw new HttpException('student not found', 404);
        }
        return student;
    }

    async remove(id: string) {
        const student = await this.studentDeletedModel.findByIdAndDelete(id)
        if (!student){
            throw new HttpException('student not found', 404);
        }
        var deleteStudentDto: DeleteStudentDto = {
            studentNumber: student.studentNumber,
            speciality: student.speciality,
            option: student.option,
            _id: student.id,
            annee: student.annee
        }
        const studentDeleted = await new this.studentDeletedModel(deleteStudentDto);
        console.log(studentDeleted);
        return studentDeleted.save();
    }
}
