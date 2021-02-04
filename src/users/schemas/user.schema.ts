import * as mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
    {
        firstName : { type : String , required : true},
        familyName : { type : String , required : true},
        cin : { type : String , required : true , unique : true},
        email : { type : String , required : true , unique : true},
        password : { type : String , required : true},
        salt : { type : String , required : true},
        sex : { type : String , required : false},
        linkedInLink: { type : String , required : false},
        role : { type : [String], required : true},
        image: {type: String, required: false}
    }
);
