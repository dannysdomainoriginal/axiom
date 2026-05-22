import { model, Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import Team from "./Team";

export interface UserI extends Document {
  name: string;
  email: string;
  password: string;
  profileImageUrl: string;
  roles: Roles[];
  teamId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  comparePassword: (password: string) => Promise<boolean>;
}

interface UserModel extends Model<UserI, {}, UserMethods> {}

const userSchema = new Schema<UserI, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please add a valid email"],
    },

    password: {
      type: String,
      required: [true, "Please provide your password"],
    },

    profileImageUrl: {
      type: String,
      default: "/images/default.jpg",
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      index: true,
    },

    roles: {
      type: [String],
      enum: ["member", "admin", "creator"],
      default: ["member"],
    },
  },
  {
    timestamps: true,
    methods: {
      async comparePassword(password: string) {
        return bcrypt.compare(password, this.password);
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified("profileImageUrl")) {
    this.profileImageUrl = this.profileImageUrl || "/images/default.jpg";
  }

  if (this.isNew && !this.teamId) {
    const newTeam = await Team.create({})

    this.teamId = newTeam._id
    this.roles = this.roles.concat(["admin", "creator"])
  }
});

const User = model<UserI, UserModel>("User", userSchema);
export default User;
