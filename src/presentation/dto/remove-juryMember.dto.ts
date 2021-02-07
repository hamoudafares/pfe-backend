import { IsNotEmpty } from 'class-validator';

export class RemoveJuryMemberDto {
  @IsNotEmpty()
  juryMemberID : string
}
