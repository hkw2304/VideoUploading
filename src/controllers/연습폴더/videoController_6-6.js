let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];
export const tranding = (req, res) => {
  // 영상들을 배열식으로 넣기 연습

  res.render("home", { pageTitle: "Home", videos: videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  // const id = req.params.id;
  const video = videos[id - 1];
  res.render("watch", {
    pageTitle: `Watching
   ${video.title}`,
    video,
  });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = (req, res) => {
  // redirect : 자동으로 설정한 url로 이동하게 한다.
  const { id } = req.params;
  // body : name값을 가져 온다., 모든 input은 name가져야 한다. 왜냐 폼은 데이터들을 넘겨주기 때문에.
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
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
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title: title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
