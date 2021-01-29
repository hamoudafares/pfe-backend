import {CreateUserDto} from '../../users/dto/create-user.dto';

export class CreateTeacherDto extends CreateUserDto{
  readonly speciality: string;
  readonly annee: string;
}
