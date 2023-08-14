import User from "../../models/User";
import bcrypt from "bcrypt";
import { response } from "express";
import fetch from "node-fetch";
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  // 중복체크는 exists로,  두개를 or 체크
  const exists = await User.exists({ $or: [{ username }, { email }] });
  // const usernameExits = await User.find({ username });
  const pageTitle = "Join";
  // 비번확인
  if (password !== password2) {
    // 브라우저는 코드200을 준다 <=== 문제가 없다
    // 하지만 우리가 직접 문제가 있다고 400을줘야 한다.
    return res.status(400).render("Join", {
      pageTitle,
      errorMessage: "password confirm not match",
    });
  }
  if (exists) {
    return res.status(400).render("Join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }
  // 두개의 경우의 수는 코드 수가 많아지니 위의 존재 여부를 간결하게 확인
  // const emailExists = await User.exists({ email });
  // if (emailExists) {
  //   return res.render("Join", {
  //     pageTitle,
  //     errorMessage: "This email is already taken",
  //   });
  // }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const edit = (req, res) => {
  res.send("Edit User");
};
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  // 계정 존재 확인
  const { username, password } = req.body;
  const pageTitle = "Login";
  // find : 전체나 여러개를 보고 싶을때
  // findOne : 해당하는 한가지만
  const user = await User.findOne({ username, socialOnly: false });
  // const exists = await User.exists({ username });
  if (!user) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "no exists" });
  }
  // bcrypt.compare : 해시값 비교가능
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Wrong pwd!!!" });
  }
  // 로그인하면 세션을 준다.
  // userd대한 정보를 저장한다.
  // 이제 이정보를 pug로 줘야함
  // locals이란 것은 express가 pug에서 그냥 사용할 수 있게 해준다.
  // 즉 pug에서 locals object에 그냥 접근 가능(변수명으로 그냥 접근 가능)

  // session 초기화부분
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};
// 유저를 github 로그인사이트로 보내주는 주소 작업 중
export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read_user user:email",
  };
  // new URLSearchParams().toString() : 객체안의 값들을 주소처럼 인코딩해준다.
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
// 내가 설정한 github사이트로 이동시켜준다.
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  // fetch는 브라우저만 돌아가고 node.js에선 작동안해서 fetch설치해야함 버전은 2.6.1

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  // 토큰으로 접근한다.
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObject = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    console.log(emailObject);
    if (!emailObject) {
      return res.redirect("/login");
    }
    // const test = await User.findOne({ e: emailObject.email });
    // console.log(test);
    let user = await User.findOne({ email: emailObject.email });
    // console.log(existingUser);
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObject.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  // 세션을 파괴해서 로그아웃
  req.session.destroy();
  return res.redirect("/");
};
export const see = (req, res) => {
  res.send("See User");
};
