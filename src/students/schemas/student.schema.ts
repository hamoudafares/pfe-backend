import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const pfe = new mongoose.Schema({
    sujet: {type: String, required: true},
    rapport: {type: String, required: true},
    entreprise: {type: String, required: true},
    mission: {type: [String], required: true},
    motsCles: {type: [String], required: true},
    valid: {type: Boolean, default: false}
});
export const StudentSchema = new mongoose.Schema({
    studentNumber: {type: Number, required: true},
    option: {type: String, required: true},
    speciality: {type: String, required: true},
    annee: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    pfe: {type: pfe, required: false},
    supervisor: {type: Schema.Types.ObjectId, ref: "Teacher", required: false}
});
