
import { Types } from "mongoose";
import { IAdmin } from "../models/admin.model";

class AdminDto {
	id:Types.ObjectId;
	login:string;

	constructor(user: IAdmin) {
		this.id=user._id;
		this.login = user.login;
		
	}
}

export default AdminDto;
