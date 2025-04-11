const buildASnowmanId = "zm4VcCdZ84U";
// const buildASnowmanId = "ScMzIvxBSi4";
// const buildASnowmanId = "TeQ_TTyLGMs";

function onYouTubeIframeAPIReady() {
  new YT.Player("yt-player", {
    videoId: buildASnowmanId,
    events: { onReady: onPlayerReady },
  });
}

function onPlayerReady(event) {
  document.body.addEventListener(
    "click",
    function () {
      event.target.playVideo();
    },
    { once: true }
  );
}
