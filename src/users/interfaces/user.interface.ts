import {Document} from "mongoose";

export interface IUser extends Document{
    _id : string ;
    firstName : string;
    familyName : string;
    cin : string;
    email : string;
    password : string;
    salt : string;
    role : string;
}
