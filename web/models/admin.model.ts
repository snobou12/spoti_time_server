import { Schema, Types, model } from "mongoose";

export interface IAdmin{
    _id:Types.ObjectId;
    id:string;
    login:string;
    password:string;
}

const adminSchema = new Schema<IAdmin>(
    {
        login:{
            type:String,
            unique:true,
            required:true
        },
        password:{
            type:String,required:true,unique:false
        }
    },
    {timestamps:true}
)

const AdminModel = model<IAdmin>("Admin",adminSchema);
export default AdminModel;