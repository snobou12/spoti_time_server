import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";
import OtherController from "../controllers/other.controller";
import ServicesController from "../controllers/services-controller";
import PromocodesController from "../controllers/promocodes.controller";
import InvoicesController from "../controllers/invoices.controller";
const router = Router();

//admin
router.post("/login",UserController.login)
router.post('/logout', UserController.logout);
router.get('/refresh', UserController.refresh);
//hide
// router.post('/registrationAdmin',UserController.registrationAdmin);



//users
router.get('/getUsers',authMiddleware,UserController.getUsers);
router.get("/searchUsers",authMiddleware,UserController.searchUsers);
router.post("/sendMessageFromBot",authMiddleware,UserController.sendMessageFromBot);


//others
router.get("/getMainData",authMiddleware,OtherController.getMainData);


//prices
router.get("/getServices",authMiddleware,ServicesController.getServices);
router.post("/changeService",authMiddleware,ServicesController.changeService);


//promocodes
router.get("/getPromocodes",authMiddleware,PromocodesController.getPromocodes);
router.post("/deletePromocode",authMiddleware,PromocodesController.deletePromocode);
router.post("/createPromocode",authMiddleware,PromocodesController.createPromocode);

//invoices
router.get("/getInvoices",authMiddleware,InvoicesController.getInvoices);





export default router;
