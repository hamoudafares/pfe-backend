import {Document} from "mongoose";

export interface IUser extends Document{
    firstName : string;
    familyName : string;
    cin : string;
    email : string;
    password : string;
    salt : string;
}
