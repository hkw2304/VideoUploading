import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  upload,
  deleteVideo,
} from "../controllers/videoController";
const videoRouter = express.Router();
// const handleWatch = (req, res) => {
//   res.send("Watch Video");
// };
// const handleEdit = (req, res) => {
//   res.send("Edit Video");
// };
// 파라미터 밑에도 두면 upload도 변수라 생각해서 upload를 맨 위로 올려준다.
// 정규식을 사용해서 숫자만 오게 한다., 자바스크립트는 \\로 해줘야 한다.
// get or post 방식으로 넘겨준다
videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", watch);
// 짧게 쓰기
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
// 서버에게 보내는 방식을 알려줘야 오류가 안남
// videoRouter.get("/:id(\\d+)/edit", getEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
