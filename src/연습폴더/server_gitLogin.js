// import : 외부의 어떤 파일을 가져오기위함

import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "../routers/rootRouter";
import userRouter from "../routers/userRouter";
import videoRouter from "../routers/videoRouter";
import { localsMiddleware } from "../middlewares";
import MongoStore from "connect-mongo";

const app = express();
const morganMiddle = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// 세션설정
// 사이트로 들어오는 모든것을 기억
// express가 알아서 브라우저를 위한 id를 만들고 준다.
// 그리고 브라우저가 id를 저장하여 기억
// 즉 유저에게 쿠키를줘서 방문할때마다 백엔드에서 쿠키를보고 판별
app.use(
  session({
    // 초기 설정을 할 수 있다.
    // session의 이름?? 이름을 타고 다른 사람이 나인척 할 수 있는것을 방지
    secret: process.env.COOKIE_SECRET,
    // 쿠키 생존 시간 설정
    // cookie: {
    //   maxAge: 20000,
    // },
    // 세션이 수정이 될 때만 db에 저장해라(true : 무조건 다 저장, fasle: 수정될때만)
    // 둘 다 비슷한 말이다, 보통 절약을 위해 false설정
    resave: false,
    saveUninitialized: false,
    // session의 데이터들을 db에 저장
    // session은 우리의 브라우저가 만들어질때 자동 생성
    // 데이터가 db에 저장되서 다시 들어와도 유지된다.
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
// 백엔드에서 어떤 쿠키를 받는지 보기위한 것
// app.use((req, res, next) => {
//   res.locals.변수명 = 변수;
//   res.locals.sexy = "you";
//   res.locals.sitename = "hello youtube";
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

// app.get("/add-one", (req, res, next) => {
//   req.session.potato += 1;
//   return res.send(`${req.session.id}\n${req.session.potato}`);
// });
// ===============================
app.use(localsMiddleware);
app.use(morganMiddle);
app.use(express.urlencoded({ extended: true }));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
