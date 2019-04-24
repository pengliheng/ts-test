import { Schema, model } from "mongoose";

// export interface IUser extends Document {
//   email: string;
//   firstName: string;
//   lastName: string;
// }

const UserSchema: any = new Schema({
  email: { type: String, default: "" },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" }
});

// Export the model and return your IUser interface
export default (table: string) => model<any>(table, UserSchema);
