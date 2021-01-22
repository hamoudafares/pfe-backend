import * as mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
    {
        id : String ,
        firstName : { type : String , required : true},
        familyName : { type : String , required : true},
        cin : { type : String , required : true},
        email : { type : String , required : true},
        password : { type : String , required : true},
        salt : { type : String , required : true},
    }
);
