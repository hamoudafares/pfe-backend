import { Document, Schema } from 'mongoose';

export interface IPresentation extends Document{
  room : string,
  datetime : Date,
  jury : [string],
  president : string,
  student : string,
  session : any
}
