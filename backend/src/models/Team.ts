import { model, Schema, Model, Document, Types } from "mongoose";

interface TeamI extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamModel extends Model<TeamI, {}, {}> {}

const teamSchema = new Schema<TeamI, TeamModel>(
  {},
  {
    timestamps: true,
  },
);

const Team = model<TeamI, TeamModel>("Team", teamSchema);
export default Team;
