import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const StudentSchema = new mongoose.Schema({
    studentNumber: {type: Number, required: true},
    option: {type: String, required: true},
    speciality: {type: String, required: true},
    annee: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true}
});
