import express from "express";

// server :항상 켜져있는 컴퓨터, 클라의 request를 받기 위해 server는 항상 listen 상태이다.
// express() : express 어플 생성

const PORT = 4000;
const app = express();

// express에는 1.requests, 2.response object를 제공한다
// res.end() : request 종료
// res.send() : 텍스트 전달
const handleHome = (req, res) => {
  return res.send("<h1>I still love you<h1>");
};
const handleLogin = (req, res) => {
  return res.send({ message: "login here!" });
};
// get() : 무엇을 가져와라
// get("/:루트", 가져올 함수)
// "/"뒤에 아무것도 없으면 브라우저는 클라한테 계속 request하는 중이다 지금 이 페이지가 필요해!! 라고
app.get("/", handleHome);
app.get("/login", handleLogin);

// listen(포트, 받을 함수)
// port는 보통 높은 번호는 비어있다.

// 서버에서 작동하는거라서 application이 생성되고 만들어져야 한다.
const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
// 서버가 만들어 졌고 4000번 port를 listening 하고 있다.
