// 또 따로 분리 해준다.

// 실행함과 동시에 자동실행이라 짧게 쓰기 가능
import "./db";
import "./models/Video";
// import db from "./db";
// import Video from "./models/Video";
import app from "./server";

const PORT = 4501;

const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
