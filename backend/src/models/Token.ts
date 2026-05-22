import { model, Schema, Model, Document, Types } from "mongoose";
import { randomInt } from "crypto";

interface TokenI extends Document {
  type: string;
  code: string;
  teamId: Types.ObjectId;
  inviteAs: "member" | "admin";
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

    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },

    inviteAs: {
      type: String,
      enum: ["member", "admin"],
      required: true,
    },

    expires: {
      type: Date,
      default: Date.now,
      expires: 24 * 60 * 60,
    },
  },
  {
    timestamps: false,
  },
);

/* -------------------------------------------------------------------------- */
/*                                CREATE INVITE                               */
/* -------------------------------------------------------------------------- */
tokenSchema.statics.createInvite = async function (teamId: Types.ObjectId) {
  const code = randomInt(100000, 1000000).toString();
  return this.create({ code, teamId });
};

/* -------------------------------------------------------------------------- */
/*                               NULLIFY INVITE                               */
/* -------------------------------------------------------------------------- */
tokenSchema.statics.nullifyInvite = async function (
  code: string,
  teamId: Types.ObjectId,
) {
  return this.deleteOne({ code, teamId });
};

const Token = model<TokenI, TokenModel>("Token", tokenSchema);
export default Token;
