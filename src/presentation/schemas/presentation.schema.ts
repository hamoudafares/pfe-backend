import * as mongoose from "mongoose";

export const PresentationSchema = new mongoose.Schema(
  {
      room : { type : String , required : true},
      datetime : { type : Date , required : true}
  }
);
