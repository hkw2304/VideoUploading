import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";
import flash from "express-flash";
const app = express();
const morganMiddle = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
// extended: true :여러개의 text를 받기 위함
app.use(express.urlencoded({ extended: true }));
// express.json : string을 받아서 다시 접근가능한 obj형으로 변환
// json형태의 string을 받는거라 알려줘야함 그래서 해당 fetch에 headers에 "Content-Type" : "application/json"추가
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use(localsMiddleware);
app.use(flash());
// 경로 인식을 위한 전역 설정
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use(morganMiddle);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
