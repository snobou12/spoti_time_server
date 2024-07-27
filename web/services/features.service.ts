/** @format */

import ApiError from "../exceptions/api.errors";
import FeaturesModel from "../models/features.model";
class FeaturesService {
	async uploadPostImage(src: string) {
		const features = await FeaturesModel.findOne();
		if (!features) {
			throw ApiError.BadRequest("UploadPostImage: features не найдены");
		}
		features.postPreviewImageSrc = src;
		await features.save();
		return "Сссылка на post image обновлена";
	}

	async getPostImageSrc() {
		const features = await FeaturesModel.findOne();
		if (!features) {
			throw ApiError.BadRequest("UploadPostImage: features не найдены");
		}
		return features.postPreviewImageSrc;
	}
}

export default new FeaturesService();
