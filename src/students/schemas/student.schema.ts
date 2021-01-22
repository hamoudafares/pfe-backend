import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema({
    studentNumber: Number,
    option: String,
    speciality: String,
    annee: String
});
