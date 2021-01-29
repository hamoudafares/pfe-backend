import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export const SessionSchema = new mongoose.Schema(
    {
            anneeUniversitaire : { type : String , required : true},
            president : {type: Schema.Types.ObjectId, ref: "Teacher", required: true}
    }
);
