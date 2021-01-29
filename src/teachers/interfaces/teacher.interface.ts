import {Document} from 'mongoose';

export interface TeacherInterface extends Document {
  readonly speciality: string;
  readonly annee: string;
  readonly user: string;
}
