import Video from "../models/Video";
// find({형식}, 실행함수) :db에서 데이터를 찾는다.
// 업데이트되서 영상이랑 다름
// {} : 비어 있다면 모든 형식을 찾는것
// Video.find()
//   .then(function (videos, error) {})
//   .catch(function (err) {
//     console.log(err);
//   });

// promise(db에서 자료를 찾는 방식)
// await은 함수안에서만 작동이 가능한데 async를 적용해서 사용 가능
export const home = async (req, res) => {
  // try {
  //   const videos = await Video.find({});
  //   return res.render("home", { pageTitle: "Home", videos });
  // } catch (error) {
  //   return res.render("server-error", { error });
  // }
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  // findById : 해당 id로 해당 영상을 찾을 수 있다.
  const videos = await Video.findById(id);

  if (videos) {
    return res.render("watch", {
      pageTitle: videos.title,
      videos,
    });
  }
  return res.render("404", { pageTitle: "Video not found." });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const videos = await Video.findById(id);
  console.log(videos);
  if (videos) {
    return res.render("edit", {
      pageTitle: `Editing: ${videos.title}`,
      videos,
    });
  }
  return res.render("404", { pageTitle: "Video not found." });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  // 해당 영상을 찾는 방법 원하는거 써라
  const videos = await Video.findById(id);
  // const videos = await Video.exists({ _id: id });
  if (videos) {
    // 축약형(훨 씐 좋다)
    // findByIdAndUpdate(id, 변경내용) : 해당 아이디를 업데이트 해준다.
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      haghtags: hashtags
        .split(",")
        .map((word) => (word.startsWith("#") ? word : `#${word}`)),
    });
    // videos.title = title;
    // videos.description = description;
    // // #중복 체크
    // videos.hashtags = hashtags
    //   .split(",")
    //   .map((word) => (word.startsWith("#") ? word : `#${word}`));
    // await videos.save();
    return res.redirect(`/videos/${id}`);
  }
  return res.render("404", { pageTitle: "Video not found." });
};
export const search = (req, res) => {
  res.send("Search");
};
export const deleteVideo = (req, res) => {
  return res.send(`Watch Video #${req.params.id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;
    // mongoose는 유효성 검사를 해준다.
    // 영상을 만들기 위해서는 document를 만들어야 한다.
    // 방법 1. 객체를 만든다
    // const video = new Video({
    //   title: title,
    //   description,
    //   createdAt: Date.now(),
    //   // 문자입력시 앞에 #이 붙게 함
    //   hashtags: hashtags.split(",").map((word) => `#${word}`),
    //   meta: {
    //     views: 0,
    //     rating: 0,
    //   },
    // });
    // 이제 비디오를 저장하고 db에 넘겨줘야 한다.
    // 저장하고 넘겨주는데 시간이 걸리기 때문에 await를 걸어준다.
    // await video.save();
    // 방법 2.
    await Video.create({
      title: title,
      description,

      // 문자입력시 앞에 #이 붙게 함
      hashtags: hashtags
        .split(",")
        .map((word) => (word.startsWith("#") ? word : `#${word}`)),
    });
    return res.redirect("/");
  } catch (error) {
    // 에러 발생시 홈을 다시 가지않고 계속 머무른다.
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
