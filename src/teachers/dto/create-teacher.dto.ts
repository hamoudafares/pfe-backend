import {CreateUserDto} from '../../users/dto/create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateTeacherDto extends CreateUserDto{
  @IsNotEmpty()
  readonly speciality: string;
  @IsNotEmpty()
  readonly annee: string;
  @IsNotEmpty()
  readonly sex: string;
  readonly linkedInLink: string;

}
