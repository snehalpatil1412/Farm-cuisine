import express from "express";
import { 
    registerController , 
    loginController , 
    testController 
} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
//route object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post('/register' , registerController);

//Login || POST
router.post('/login', loginController);

//test route
router.get('/test', requireSignIn, isAdmin, testController);

export default router 