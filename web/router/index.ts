/** @format */

import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";
import OtherController from "../controllers/other.controller";
import ServicesController from "../controllers/services-controller";
import PromocodesController from "../controllers/promocodes.controller";
import InvoicesController from "../controllers/invoices.controller";
import PostingController from "../controllers/posting.controller";
import { uploader } from "../core/multer";
import FeaturesController from "../controllers/features.controller";
const router = Router();

//admin
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
//hide
// router.post('/registrationAdmin',UserController.registrationAdmin);

//users
router.get("/getUsers", authMiddleware, UserController.getUsers);
router.get("/searchUsers", authMiddleware, UserController.searchUsers);
router.post(
	"/sendMessageFromBot",
	authMiddleware,
	UserController.sendMessageFromBot
);
router.post(
	"/getUserCategoryByUserId",
	authMiddleware,
	UserController.getUserCategoryByUserId
);
router.post(
	"/updateUserCategory",
	authMiddleware,
	UserController.updateUserCategory
);

//others
router.get("/getMainData", authMiddleware, OtherController.getMainData);
router.get("/getBannedUsers", authMiddleware, OtherController.getBannedUsers);

//prices
router.get("/getServices", authMiddleware, ServicesController.getServices);
router.post("/changeService", authMiddleware, ServicesController.changeService);

//promocodes
router.get(
	"/getPromocodes",
	authMiddleware,
	PromocodesController.getPromocodes
);
router.post(
	"/deletePromocode",
	authMiddleware,
	PromocodesController.deletePromocode
);
router.post(
	"/createPromocode",
	authMiddleware,
	PromocodesController.createPromocode
);
router.post(
	"/switchFeaturePromocode",
	authMiddleware,
	PromocodesController.switchFeaturePromocode
);

//invoices
router.get("/getInvoices", authMiddleware, InvoicesController.getInvoices);
router.post("/deleteInvoice", authMiddleware, InvoicesController.deleteInvoice);

//posting
router.post("/sendTestPost", authMiddleware, PostingController.sendTestPost);
router.post(
	"/uploadPostImage",
	authMiddleware,
	uploader.single("post-image"),
	PostingController.uploadPostImage
);

router.post("/sendPost", authMiddleware, PostingController.sendPost);

//features

router.get(
	"/getPostImageSrc",
	authMiddleware,
	FeaturesController.getPostImageSrc
);

export default router;
