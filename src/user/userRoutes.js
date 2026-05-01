import { Router } from "express";
import {
  createUser,
  login,
  sendEmail,
  forgotPassword,
  verifyToken,
  changePassword,
  logout,
  updateStatus,
  getAllUsers,
} from "./userController.js";
import {
  verifyTokenGuard,
  AdminUserGuard,
  AdminGuard,
} from "../middleware/guardMiddleware.js";

const userRouter = Router();

//@POST /api/user/signup
userRouter.post("/signup", createUser); // by this end point it transfer into to createUser

//@POST /api/user/login
userRouter.post("/login", login);

userRouter.get("/logout", logout);

userRouter.post("/send-mail", sendEmail);

userRouter.get("/get", AdminGuard, getAllUsers);

userRouter.put("/status/:id", AdminGuard, updateStatus);

userRouter.post("/forgot-password", forgotPassword);

userRouter.get("/session", AdminUserGuard, (req, res) => {
  return res.json(req.user);
});

userRouter.post("/verify-token", verifyTokenGuard, verifyToken);

userRouter.put("/change-password", verifyTokenGuard, changePassword);
export default userRouter;
