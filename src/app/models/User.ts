import { Document, Schema, model } from 'mongoose';

interface IUser extends Document {
  email: string;
  senha: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
});

const User = model<IUser>('User', UserSchema);
export default User;
