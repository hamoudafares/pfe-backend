import {CreateUserDto} from "../../users/dto/create-user.dto";

export class CreateStudentDto {
    readonly studentNumber: number;
    readonly option: string;
    readonly speciality: string;
    readonly annee: string;
}
