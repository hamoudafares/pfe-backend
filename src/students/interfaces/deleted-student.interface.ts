import {Document} from "mongoose";

export interface DeletedStudentInterface extends Document {
    readonly studentNumber: number,
    readonly option: string,
    readonly speciality: string,
    readonly annee: string
}
