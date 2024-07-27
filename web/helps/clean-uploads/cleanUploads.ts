/** @format */

import fs from "fs";
import path, { resolve } from "path";

export function cleanUploads(exceptFile: string) {
	const uploadsDir = resolve("./uploads");
	fs.readdir(uploadsDir, (err, files) => {
		if (err) {
			return console.error("Unable to scan directory:", err);
		}

		files.forEach(file => {
			const filePath = path.join(uploadsDir, file);

			if (file !== exceptFile) {
				fs.unlink(filePath, err => {
					if (err) {
						console.error("Error deleting file:", filePath, err);
					} else {
						console.log("Deleted file:", filePath);
					}
				});
			}
		});
	});
}
