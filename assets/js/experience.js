const $ = (selector) => document.querySelector(selector);
const sec = $("#scrub");
const video = $("#scrub-video");
const bar = $("#scrub-bar");
const time = $("#v-time");
const copy = $("#hero-copy");
const hint = $("#scroll-hint");
const overlays = [...document.querySelectorAll(".ov")];
const playbackConst = 500;
let progress = 0;
let framePending = false;

const formatTime = (seconds) =>
  Number.isFinite(seconds)
    ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`
    : "0:00";

const updateProgress = () => {
  framePending = false;
  const scrollRange = sec.offsetHeight - innerHeight;
  if (scrollRange <= 0) return;
  progress = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / scrollRange));
  if (video.duration) video.currentTime = progress * video.duration;
  bar.style.width = `${progress * 100}%`;
  time.textContent = `${formatTime(progress * (video.duration || 0))} / ${formatTime(video.duration)}`;

  const headlineOpacity = Math.max(0, 1 - progress / 0.12);
  copy.style.opacity = headlineOpacity;
  copy.style.transform = `translateY(${(1 - headlineOpacity) * -40}px)`;
  hint.style.opacity = progress > 0.02 ? 0 : "";
  overlays.forEach((overlay) => {
    const start = Number(overlay.dataset.at);
    overlay.classList.toggle("on", progress >= start && progress < start + 0.22);
  });
};

const scheduleProgress = () => {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateProgress);
};

const setScrollHeight = () => {
  if (Number.isFinite(video.duration) && video.duration > 0) {
    sec.style.height = `${innerHeight + video.duration * playbackConst}px`;
  }
  scheduleProgress();
};

addEventListener("scroll", scheduleProgress, { passive: true });
addEventListener("resize", setScrollHeight);
video.addEventListener("loadedmetadata", setScrollHeight);
setScrollHeight();
