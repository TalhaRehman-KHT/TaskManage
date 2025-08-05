import express from "express";
import { testController } from "../controllers/testController.js";
import { registerUser } from "../controllers/registerUser.js";
import { login } from "../controllers/loginUser.js";
import { isAuthenticated } from "../utils/passwordUtils.js";
import { isAuthorized } from "../utils/passwordUtils.js";
import { getDashboard } from "../controllers/getDashboard.js";
import { getAllUsers } from "../controllers/getAllUsers.js";
import { logout } from "../controllers/logout.js";
import upload from "../middleware/upload.js";


const router = express.Router();

// Example route: http://localhost:4000/api/v1/test
router.get('/test', testController);

// Register user   path ==> http://localhost:4000/api/v1/register
// router.post('/register', registerUser);
router.post('/register', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'cvFile', maxCount: 1 },
]), registerUser);


// Register user   path ==> http://localhost:4000/api/v1/login
router.post('/login', login);


//          path ==> http://localhost:4000/api/v1/dashboard 
router.get('/dashboard', isAuthenticated, getDashboard);
//          path ==> http://localhost:4000/api/v1/allusers
router.get('/allUser', isAuthenticated, isAuthorized, getAllUsers);

//    path ==> http://localhost:4000/api/v1/logout
router.post("/logout", logout)

export default router;
