import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },  // Ensure uniqueness of username
    email: { type: String, required: true, unique: true },     // Ensure uniqueness of email
    password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
