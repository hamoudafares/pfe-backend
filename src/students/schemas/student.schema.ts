import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const StudentSchema = new mongoose.Schema({
    studentNumber: Number,
    option: String,
    speciality: String,
    annee: String,
    user: {type: Schema.Types.ObjectId, ref: "User", required: true}
});
