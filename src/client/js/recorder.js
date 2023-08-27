// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
// const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
const startBtn = document.querySelector("#startBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "MyRecording.webm",
  thumb: "myThumbnail.jpg",
};
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  // console.log(createFFmpeg);

  // const ffmpeg = await createFFmpeg({
  //   log: true,
  // });
  // await ffmpeg.load();
  // ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  // await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  let canvas = document.createElement("canvas");
  let canvasContext = canvas.getContext("2d");
  canvas.width = 250;
  canvas.height = 140;
  canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
  let dataURI = canvas.toDataURL("image/jpeg");

  downloadFile(dataURI, files.thumb);
  downloadFile(videoFile, files.input);

  // const thumb = document.createElement("a");
  // thumb.href = dataURI;
  // thumb.download = files.thumb;
  // thumb.click();

  // const a = document.createElement("a");
  // a.href = videoFile;
  // a.download = files.input;
  // document.body.appendChild(a);
  // a.click();
  init();
  startBtn.innerHTML = "Start Recording";
  startBtn.removeEventListener("click", handleDownload);
  startBtn.addEventListener("click", handleStart);
};

const handleStop = (e) => {
  video.width = 1024;
  video.height = 576;
  startBtn.innerHTML = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  startBtn.innerHTML = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    // console.log("done!!");
    // console.log(e);
    // console.log(event.data);
    // 파일을 가리키는 URL
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  //   console.log(recorder);
  recorder.start();
  //   console.log(recorder);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
