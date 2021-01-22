import {Document} from "mongoose";

export interface IUser extends Document{
    firstName : String;
    familyName : String;
    cin : String;
    email : String;
    password : String;
    salt : String;
    role : String;
}
