import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  deleteVideo,
  getUpload,
  postUpload,
} from "../controllers/videoController";
import { protectedMiddleware } from "../middlewares";
const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .get(getUpload)
  .all(protectedMiddleware)
  .post(postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectedMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectedMiddleware)
  .get(deleteVideo);

export default videoRouter;
