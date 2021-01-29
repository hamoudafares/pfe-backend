import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto  {
  firstName : string;
  familyName : string;
  cin : string;
  email : string;
}
