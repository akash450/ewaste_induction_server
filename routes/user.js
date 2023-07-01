import express from "express";
import { getUserPoints, getUserRole, login, logout, register, resetPassword, getMail, updateUserPoints } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

//http://localhost:4000/api/v1/user/login
router.post("/login", login);
//http://localhost:4000/api/v1/user/register
router.post("/register", register);
//http://localhost:4000/api/v1/user/logout
router.get("/logout", isAuthenticated, logout);

//http://localhost:4000/api/v1/user/points
router.get("/points", isAuthenticated, getUserPoints);

//http://localhost:4000/api/v1/user/role
router.get("/role", isAuthenticated, getUserRole);

//http://localhost:4000/api/v1/user/changepoints
router.put("/changepoints", isAuthenticated, updateUserPoints);

//Reset password route
router.put("/forgotpassword", resetPassword);

router.post("/sendemail", isAuthenticated, getMail);

export default router;