const playlist = [
  "TeQ_TTyLGMs", // snowman
  "L0MK7qz13bU", // let it go
  // "zm4VcCdZ84U", // snowman bad
  // "C4knNWvN_sk", // test
  // "zJP9Nnvng3Q", // test
];
let player;
let currentVideo = 0;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    videoId: playlist[currentVideo],
    events: { onReady, onStateChange },
  });
}

function onReady(event) {
  const { body } = document;
  body.addEventListener("click", () => player.playVideo(), { once: true });
}

function onStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    currentVideo = (currentVideo + 1) % playlist.length;
    event.target.loadVideoById(playlist[currentVideo]);
  }
}
