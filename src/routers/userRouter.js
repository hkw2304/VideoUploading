import express from "express";
import {
  postEdit,
  getEdit,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectedMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";
const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectedMiddleware)
  .get(getEdit)
  // multer는 post에 사용, 먼저 파일을 받고 파일정보를 post로 전달
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectedMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/logout", protectedMiddleware, logout);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", protectedMiddleware, see);
export default userRouter;
