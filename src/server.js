import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
// console.log(process.cwd()); 현재 경로
const app = express();

const morganMiddle = morgan("dev");
// express에게 뷰엔진으로 pug를 사용한다고 알려줘여한다.
app.set("view engine", "pug");
// 실행 주소값을 변경
app.set("views", process.cwd() + "/src/views");

app.use(morganMiddle);

// express가 폼의 동작들을 이해하게 해준다 반드시 routes을 실행하기전에 적는다.
app.use(express.urlencoded({ extended: true }));

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
