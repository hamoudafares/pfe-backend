import { IsNotEmpty } from 'class-validator';

export class CreatePresentationDto {

  room : string;
  datetime : Date;
}
