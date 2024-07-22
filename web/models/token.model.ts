import { Schema, model,ObjectId } from "mongoose";


export interface IToken{
    user:ObjectId;
    refreshToken:string;
}

const tokenSchema = new Schema<IToken>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
});

const TokenModel = model<IToken>("Token", tokenSchema);
export default TokenModel;


