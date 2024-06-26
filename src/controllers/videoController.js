import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "asc" })
    .populate("owner");

  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const videos = await Video.findById(id)
    .populate("owner")
    .populate("comments");
  console.log(videos);
  if (videos) {
    return res.render("watch", {
      pageTitle: videos.title,
      videos,
    });
  }
  return res.status(404).render("404", { pageTitle: "Video not found." });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const videos = await Video.findById(id);
  if (!videos) {
    res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(videos.owner) !== String(_id)) {
    req.flash("error", "Your are not the owner of the video");
    return res.status(403).redirect("/");
  }
  return res.render("edit", {
    pageTitle: `Editing: ${videos.title}`,
    videos,
  });
};
export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const videos = await Video.findById(id);
  if (!videos) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(videos.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "ok!!");
  return res.redirect(`/videos/${id}`);
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`^${keyword}`),
      },
    }).populate("owner");
  }
  res.render("search", { pageTitle: "search", videos });
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const videos = await Video.findById(id);
  if (!videos) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(videos.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  // console.log(req.files);
  const { video, thumb } = req.files;
  console.log(video, thumb);
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title: title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : video[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
  // status : render 후에 상태 코드를 정함
  // sendStatus : 상태를 보고 연결을 끊음
};
export const createComment = async (req, res) => {
  // const { id } = req.params;
  // const { text } = req.body;
  // const { session } = req.session.user;
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  console.log("info!!!!", video);
  if (!video) {
    return res.sendstatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  console.log("!!!!!!!!!!!!!!comment : ", comment);
  video.comments.push(comment._id);
  console.log("info(idAdd)", video);
  // console.log(video);
  video.save();
  return res.sendStatus(201);
};
