import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";
import OtherController from "../controllers/other.controller";
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




export default router;
