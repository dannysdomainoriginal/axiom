import { model, Schema } from "mongoose";

const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  verificationToken: {
    type: String,
    default: "",
  },

  passwordResetToken: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

const Token = model("Token", tokenSchema);
export default Token;
