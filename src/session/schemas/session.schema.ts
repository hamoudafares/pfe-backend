import * as mongoose from "mongoose";

export const SessionSchema = new mongoose.Schema(
    {
            anneeUniversitaire : { type : String , required : true}
    }
);
