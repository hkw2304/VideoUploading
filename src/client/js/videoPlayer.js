const video = document.querySelector("video");
const videoWrap = document.querySelector(".video-wrap");
// const playBtn = document.querySelector("#play");
// const muteBtn = document.querySelector("#mute");
// const volumeRange = document.querySelector("#volume");
// const currentTime = document.querySelector("#currentTime");
// const totalTime = document.querySelector("#totalTime");
// const timeLine = document.querySelector("#timeLine");
// const fullScreenBtn = document.querySelector("#fullScreen");
// const videoContainer = document.querySelector("#videoContainer");
// const videoControls = document.querySelector("#videoControls");

let controlsMovementTimeout = null;
let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;
// 버튼을 만들어서 이쁘게 꾸미는 중
const handlePlayClick = (e) => {
  // 비디오가 멈추면 true, 아니면 false
  if (video.paused) {
    // playBtn.innerHTML = "Pause";
    video.play();
  } else {
    // playBtn.innerHTML = "Play";
    video.pause();
  }
  // 한줄로 변형 가능
  playBtn.innerHTML = video.paused ? "Play" : "Pause";
};
// const handlePause = () => {
//   playBtn.innerHTML = "Play";
// };
// const handlePlay = () => {
//   playBtn.innerHTML = "Pause";
// };
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
    // muteBtn.innerHTML = "Mute";
  } else {
    video.muted = true;
    // muteBtn.innerHTML = "unMute";
  }
  muteBtn.innerHTML = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerHTML = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};
const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(11, 19);
};
const handleLoadedMetadata = () => {
  totalTime.innerHTML = formatTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerHTML = formatTime(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};
const handleTimeLineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    fullScreenBtn.innerHTML = "Enter Full Screen";
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerHTML = "Exit Full Screen";
  }
};
const hideControls = () => {
  videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  // 딜레이를 줘서 제거
  // setTimeout은 반환값이 있다.
  // 마우스가 현재의 자리에서 떠나면 계속해서 반환값이 나온다.
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
  const { id } = videoWrap.dataset;
  fetch(`/api/video/${id}/view`, {
    method: "POST",
  });
};
// playBtn.addEventListener("click", handlePlayClick);
// muteBtn.addEventListener("click", handleMute);
// input : 실시간 작동
// volumeRange.addEventListener("input", handleVolumeChange);
// video.addEventListener("pause", handlePause);
// video.addEventListener("play", handlePlay);

// 이미지나비디오가 로드되면 발생하는 이벤트
// video.addEventListener("loadedmetadata", handleLoadedMetadata);
// 비디오가 실행되면 발생하는 이벤트
// video.addEventListener("timeupdate", handleTimeUpdate);
// timeLine.addEventListener("input", handleTimeLineChange);
// fullScreenBtn.addEventListener("click", handleFullScreen);
// video.addEventListener("mousemove", handleMouseMove);
// video.addEventListener("mouseleave", handleMouseLeave);
// 비디오가 끝날을때의 이벤트
video.addEventListener("ended", handleEnded);
