import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export const PresentationSchema = new mongoose.Schema(
  {
        room : { type : String , required : true},
        datetime : { type : Date , required : true},
        president : {type: Schema.Types.ObjectId, ref: "Teacher", required: true},
        student : {type: Schema.Types.ObjectId, ref: "Student", required: true},
        session : {type: Schema.Types.ObjectId, ref: "Session", required: true},
        jury : [{type: Schema.Types.ObjectId, ref: "Teacher", required: true}]
  }
);
