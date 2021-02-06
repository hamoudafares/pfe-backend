import { Document, Schema } from 'mongoose';

export interface IPresentation extends Document{
  room : string,
  datetime : string,
  jury : [string],
  president : string,
  student : string,
  session : any
}
