const videoWrap = document.querySelector(".video-wrap");
const form = document.querySelector("#commentForm");
// const textarea = form.querySelector("textarea");
// const btn = form.querySelector("button");
const addComment = (text, id) => {
  const videoCommentList = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  // newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerHTML = ` ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoCommentList.prepend(newComment);
};
const handleSubmit = async (event) => {
  // 버튼 클릭을 감지하는것이 아니라 form이 데이터를 submit하는 것을 감지를 해야한다.
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoWrap.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/video/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // JSON.stringify : 데이터를 받아서 string형으로 변형
    body: JSON.stringify({ text }),
  });

  textarea.value = "";
  if (status === 201) {
    addComment(text);
  }
  // window.location.reload();
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
