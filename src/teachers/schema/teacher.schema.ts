import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const TeacherSchema = new mongoose.Schema({
  speciality: {type: String, required: true},
  annee: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: "User", required: true}
});
