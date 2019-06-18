const REDIRECT_URL = "https://www.youtube.com/feed/subscriptions";

function removeShitFromDOM() {
  const videos = document.querySelector("#secondary");
  if (videos) {
    videos.remove();
  }

  const videosSmall = document.querySelector(
    "ytd-watch-next-secondary-results-renderer"
  );
  if (videosSmall) {
    videosSmall.remove();
  }
}

function cleanUp() {
  removeShitFromDOM();

  const items = [
    ...Array.from(document.querySelectorAll('a[href="/"]'))
  ] as HTMLAnchorElement[];

  items.forEach((item: HTMLAnchorElement) => {
    item.href = REDIRECT_URL;
    item.onmousedown = () => {
      document.location.href = REDIRECT_URL;
    };
  });
}

cleanUp();

console.log("init");

let buttonCreated = false;

function generate_random_string(len: number){
  let out = '';
  let curCode;
  for(let i = 0; i < len; i++) {
      curCode = Math.floor((Math.random() * 25) + 97);
      out += String.fromCharCode(curCode)
  }
  return out;
}

function changeVideos() {
  const main = document.querySelector("ytd-browse");
  if (!main) {
    return;
  }

  const first = main.querySelector("#items.ytd-grid-renderer");
  if (!first) {
    return;
  }

  const videos: NodeListOf<HTMLElement> = first.querySelectorAll("ytd-grid-video-renderer");
  if (!videos) {
    return;
  }

  videos.forEach(video => {
    const image: HTMLImageElement | null = video.querySelector("#img");
    if (image) {
      const num = Math.floor(400 + Math.random() * 20);
      image.src = `http://lorempixel.com/${num*2}/${num}/`;
    }

    const time: HTMLSpanElement | null = video.querySelector("ytd-thumbnail-overlay-time-status-renderer span");
    if (time) {
      time.innerText = Math.floor(Math.random() * 1000).toString();
    }

    const title: HTMLAnchorElement | null = video.querySelector("#video-title");
    if(title) {
      title.innerText = generate_random_string(10);
    }
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === "remove_sugested") {
    console.log("clean sugested");
    cleanUp();
    sendResponse(true);
  } else if (msg.text === "change_home" && buttonCreated === false) {
    console.log("Hello world");
    const search = document.querySelector("#search-form");

    if (search) {
      const loadOther = document.createElement("button");
      loadOther.onclick = changeVideos;
      loadOther.innerHTML = "Load other";
      search.after(loadOther);

      buttonCreated = true;
    }
  }
});
