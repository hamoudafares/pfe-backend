import {Document} from "mongoose";

export interface StudentInterface extends Document {
    readonly studentNumber: number,
    readonly option: string,
    readonly speciality: string,
    readonly annee: string
}
