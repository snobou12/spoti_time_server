import { Request } from "express";
import multer from "multer";
import ApiError from "../../exceptions/api.errors";
import { v4 as uuidv4 } from 'uuid';
const allowedTypes = /jpeg|jpg|png/;

const maxMB = 5;
const maxSize = 1024 * 1024 * maxMB;
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},

	filename: (req, file, cb) => {
		const url = req.url;
		let name;
		const extension = `.${file.originalname.split(".").slice(-1)[0]}`;
		switch (url) {
			case "/uploadPostImage":
				const id = uuidv4();
				name = `${id}-post-image${extension}`;
				break;
			default:
				name =
					new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
				break;
		}

		cb(null, name);
	},
});

interface Test {
	(error: ApiError): void;
	(error: null, acceptFile: boolean): void;
}

const fileFilter: (
	req: Request,
	file: Express.Multer.File,
	cb: Test
) => void = (req, file, cb) => {
	const mimetype = allowedTypes.test(file.mimetype);
	let fileSize = 0;
	if (req.headers["content-length"]) {
		fileSize = parseInt(req.headers["content-length"]);
	}

	if (fileSize > maxSize) {
		return cb(
			ApiError.BadRequest(`Файл слишком большой (не больше ${maxMB}мб)`)
		);
	}
	if (!mimetype) {
		return cb(ApiError.BadRequest("Файл должен быть изображением"));
	} else {
		return cb(null, true);
	}
};


const uploader = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: maxSize,
	},
});

export { uploader };