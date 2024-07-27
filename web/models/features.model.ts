/** @format */

import { Schema, Types, model, Document } from "mongoose";

interface IFeatures extends Document {
	postPreviewImageSrc: string;
}

const FeaturesSchema = new Schema<IFeatures>({
	postPreviewImageSrc: {
		type: String,
		default: "",
		required: false,
	},
});

const FeaturesModel = model<IFeatures>("Features", FeaturesSchema);

export default FeaturesModel;
