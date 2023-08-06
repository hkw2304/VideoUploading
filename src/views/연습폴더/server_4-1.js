import express from "express";
import morgan from "morgan";
// server :항상 켜져있는 컴퓨터, 브라우저(나)가 request 언제 할 지 모르니 server는 항상 listen 상태이다.
// express() : express 어플 생성
// port : 브라우저와 서버의 일종의 연결통로
const PORT = 4000;
const app = express();
// const logger = (req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// };
// const privateMiddleware = (req, res, next) => {
//   const url = req.url;
//   if (url === "/protected") {
//     return res.send("<h1>Not Allowed</h1");
//   }
//   console.log("Allowed, you may continue");
//   next();
// };
// express에는 1.requests, 2.response object를 제공한다
// middleware(controller) : arguments(req, res, next) // next : 다음 함수를 호출
// res.end() : request 종료
// res.send() : 텍스트 전달
// const handleHome = (req, res) => {
//   // console.log("lalalal");
//   // return res.send("i love middleware");
//   return res.end();
// };
// const handleLogin = (req, res) => {
//   return res.send({ message: "login here!" });
// };

// morgan :GET, path, status code 등등 여러정보가 들어있다.
const morganMiddle = morgan("dev");
app.use(morganMiddle);

const globalRouter = express.Router();
const handleHome = (req, res) => {
  res.send("Home");
};
globalRouter.get("/", handleHome);

const userRouter = express.Router();
const handleEditUser = (req, res) => {
  res.send("Edit User");
};
userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();
const handleWatchVideo = (req, res) => {
  res.send("Watch Video");
};
videoRouter.get("/watch", handleWatchVideo);

// 누군가가 해당 경로(/,videos,users)로 접근을 하면 해당 함수로 안내해준다.
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
// const handleProtected = (req, res) => {
//   return res.send("Welcome to the private lounage");
// };
// get() : 무엇을 가져와라
// get("/:루트", 가져올 함수)
// "/"뒤에 아무것도 없으면 브라우저는 클라한테 계속 request하는 중이다 지금 이 페이지가 필요해!! 라고
// use() : global형태로 만들어서 app을 실행 시 무조건 실행되게 한다.

// app.use(logger, privateMiddleware);
// app.get("/", handleHome);
// app.get("/login", handleLogin);
// app.get("/protected", handleProtected);

// listen(포트, 받을 함수)
// port는 보통 높은 번호는 비어있다.

// 서버에서 작동하는거라서 application이 생성되고 만들어져야 한다.
const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
// 서버가 만들어 졌고 4000번 port를 listening 하고 있다.
