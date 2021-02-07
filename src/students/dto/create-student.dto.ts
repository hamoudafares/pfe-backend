import {CreateUserDto} from "../../users/dto/create-user.dto";
import { IsNotEmpty } from 'class-validator';

export class CreateStudentDto extends CreateUserDto{
    @IsNotEmpty()
    readonly studentNumber: number;
    @IsNotEmpty()
    readonly option: string;
    @IsNotEmpty()
    readonly speciality: string;
    @IsNotEmpty()
    readonly annee: string;
    @IsNotEmpty()
    readonly sex: string;
    readonly linkedInLink: string;
}
