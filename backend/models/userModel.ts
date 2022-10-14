import mongoose, { Schema, Model, Document } from "mongoose";

type UserDocument = Document & {
  name: string;
  hashPassword: string;
  userRole: string;
};

//Setup Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
});

// Export Contact model
const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "user",
  userSchema
);
export { User, UserDocument, userSchema };
