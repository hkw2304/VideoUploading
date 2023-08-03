import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";
const videoRouter = express.Router();
// const handleWatch = (req, res) => {
//   res.send("Watch Video");
// };
// const handleEdit = (req, res) => {
//   res.send("Edit Video");
// };
// 파라미터 밑에도 두면 upload도 변수라 생각해서 upload를 맨 위로 올려준다.
// 정규식을 사용해서 숫자만 오게 한다., 자바스크립트는 \\로 해줘야 한다.
videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
