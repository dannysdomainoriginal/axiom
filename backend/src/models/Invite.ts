import { model, Schema, Model, Document, Types } from "mongoose";
import { randomInt } from "crypto";

interface InviteI extends Document {
  type: string;
  code: string;
  teamId: Types.ObjectId;
  inviteAs: "member" | "admin";
  expires: Date;
}

interface InviteMethods {}

interface InviteModel extends Model<InviteI, {}, InviteMethods> {
  createInvite(options: {
    teamId: Types.ObjectId;
    inviteAs: string;
  }): Promise<InviteI>;
  nullifyInvite(code: string, teamId: Types.ObjectId): Promise<void>;
}

const inviteSchema = new Schema<InviteI, InviteModel, InviteMethods>(
  {
    type: {
      type: String,
      default: "admin-invite",
    },

    code: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Invite code must be exactly 6 digits"],
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
inviteSchema.statics.createInvite = async function (options: {
  teamId: Types.ObjectId;
  inviteAs: string;
}) {
  const code = randomInt(100000, 1000000).toString();
  return this.create({ code, ...options });
};

/* -------------------------------------------------------------------------- */
/*                               NULLIFY INVITE                               */
/* -------------------------------------------------------------------------- */
inviteSchema.statics.nullifyInvite = async function (
  code: string,
  teamId: Types.ObjectId,
) {
  return this.deleteOne({ code, teamId });
};

const Invite = model<InviteI, InviteModel>("Invite", inviteSchema);
export default Invite;
