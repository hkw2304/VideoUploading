import express from "express";
import { join, login } from "../controllers/userController";
import { tranding, search } from "../controllers/videoController";
// export를 const 형식이라 이름을 정확히 지정해야한다.
const globalRouter = express.Router();
// const handleHome = (req, res) => {
//   res.send("Home");
// };
// const handleJoin = (req, res) => {
//   res.send("Join");
// };
globalRouter.get("/", tranding);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

// export 하는 이유 : 모든프로젝트는 분리된 모듈이여서 바깥에 공유하기 위해서는 반드시 해야한다.
// default 하는 이유  :폴더 전체를 줄 필요가 없으니까 변수만 넘겨준다.
export default globalRouter;
