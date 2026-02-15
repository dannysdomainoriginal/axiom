import { model, Schema, Model, Document, Types } from "mongoose";
import { randomInt } from "crypto"

interface TokenI extends Document {
  type: string;
  code: string;
  expires: Date;
}

interface TokenMethods {}

interface TokenModel extends Model<TokenI, {}, TokenMethods> {
  createInvite(): Promise<TokenI>;
  nullifyInvite(code: string): Promise<void>;
}

const tokenSchema = new Schema<TokenI, TokenModel>(
  {
    type: {
      type: String,
      default: "admin-invite",
    },

    code: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Token code must be exactly 6 digits"],
    },

    expires: {
      type: Date,
      default: Date.now,
      expires: 24 * 60 * 60,
    },
  },
  {
    timestamps: false,
    statics: {
      async createInvite() {
        const code = randomInt(100000, 1000000).toString();
        return this.create({ code })
      },

      async nullifyInvite(code) {
        return this.deleteOne({ code });
      },
    },
  },
);

const Token = model<TokenI, TokenModel>("Token", tokenSchema);
export default Token;
