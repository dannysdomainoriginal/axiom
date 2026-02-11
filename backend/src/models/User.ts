import { model, Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface UserI extends Document {
  name: string;
  email: string;
  password: string;
  profileImageUrl: string;
  roles: Roles[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  comparePassword: (password: string) => Promise<boolean>;
}

interface UserModel extends Model<UserI, {}, UserMethods> {
  findByEmail: (email: string) => Promise<UserI | null>;
}

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
    statics: {
      async findByEmail(email: string) {
        return this.findOne({ email });
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
});

const User = model<UserI, UserModel>("User", userSchema);
export default User;
