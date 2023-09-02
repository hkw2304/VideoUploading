import mongoose from "mongoose";

// 연결의 성공 여부나 에러를 하기위함
// on : 클릭같은 이벤트로 여러번 발생 가능
// once : 오로지 한번만 동작
const db = mongoose.connection;
await mongoose.connect(process.env.DB_URL);
const handleOpen = () => {
  console.log("Conected to DB");
};
const handleError = () => {
  console.log("DB Error");
};
db.on("error", handleError);
db.once("open", handleOpen);
