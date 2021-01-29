import {Document} from "mongoose";

export interface IPresentation extends Document{
  room : string,
  datetime : string
}
