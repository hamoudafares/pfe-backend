import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty()
    firstName : string;
    @IsNotEmpty()
    familyName : string;
    @IsNotEmpty()
    cin : string;
    @IsEmail()
    email : string;
    sex : string;
    linkedInLink : string;
    @IsNotEmpty()
    password : string;
    @IsNotEmpty()
    role : string;
}
