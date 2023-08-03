export const tranding = (req, res) => {
  res.send("Home Page Videos");
};
export const see = (req, res) => {
  console.log(req.params);
  return res.send(`Watch Video #${req.params.id}`);
  // res.send("Watch");
};
export const edit = (req, res) => {
  // console.log(req.params);
  // return res.send("Edit");
  res.send("Edit");
};
export const search = (req, res) => {
  res.send("Search");
};
export const upload = (req, res) => {
  res.send("upload Video");
};
export const deleteVideo = (req, res) => {
  return res.send(`Watch Video #${req.params.id}`);
  // res.send("delete Video");
};
