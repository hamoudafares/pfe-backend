import {CreateUserDto} from "../../users/dto/create-user.dto";

export class CreateStudentDto extends CreateUserDto{
    readonly studentNumber: number;
    readonly option: string;
    readonly speciality: string;
    readonly annee: string;
}
