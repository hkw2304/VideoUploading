const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");

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

const handleLoadedMetadata = () => {
  totalTime.innerHTML = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerHTML = Math.floor(video.currentTime);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
// input : 실시간 작동
volumeRange.addEventListener("input", handleVolumeChange);
// video.addEventListener("pause", handlePause);
// video.addEventListener("play", handlePlay);

// 이미지나비디오가 로드되면 발생하는 이벤트
video.addEventListener("loadedmetadata", handleLoadedMetadata);
// 비디오가 실행되면 발생하는 이벤트
video.addEventListener("timeupdate", handleTimeUpdate);
