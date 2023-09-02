// 또 따로 분리 해준다.
// 실행함과 동시에 자동실행이라 짧게 쓰기 가능
// dotenv : 파일을 읽고 env에 추가해준다, 가능한 제일 먼저 실행
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
// import db from "./db";
// import Video from "./models/Video";
import app from "./server";

// 에러나면 일단 이걸로 그냐 실행
// const PORT = 4000;
const PORT = process.env.PORT || 4000;
const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
