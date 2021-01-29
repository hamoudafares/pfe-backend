import * as mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
    {
        firstName : { type : String , required : true},
        familyName : { type : String , required : true},
        cin : { type : String , required : true , unique : true},
        email : { type : String , required : true , unique : true},
        password : { type : String , required : true},
        salt : { type : String , required : true},
        role : { type : String, required : true}
    }
);
