import {CreateUserDto} from "../../users/dto/create-user.dto";
import { IsNotEmpty } from 'class-validator';

export class DeleteStudentDto {
    readonly _id: string;
    readonly studentNumber: number;
    readonly option: string;
    readonly speciality: string;
    readonly annee: string;
}
