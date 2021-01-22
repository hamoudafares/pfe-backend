import {Document} from "mongoose";
import { IUser } from '../../users/interfaces/user.interface';

export interface StudentInterface extends Document {
    readonly studentNumber: number,
    readonly option: string,
    readonly speciality: string,
    readonly annee: string,
    readonly user: string
}
