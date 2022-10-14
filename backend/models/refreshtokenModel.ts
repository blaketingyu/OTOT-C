import mongoose, { Schema, Model, Document } from "mongoose";

type RefreshTokenDoc = Document & {
  rtoken: string;
};

// Setup schema
const refreshTokenSchema = new Schema({
  rtoken: {
    type: String,
    required: true,
  },
});

// Export Contact model
const RefreshToken: Model<RefreshTokenDoc> = mongoose.model<RefreshTokenDoc>(
  "RefreshToken",
  refreshTokenSchema
);
export { RefreshTokenDoc, refreshTokenSchema, RefreshToken };
