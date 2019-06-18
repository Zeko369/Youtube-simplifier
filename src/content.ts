const REDIRECT_URL = "https://www.youtube.com/feed/subscriptions";

function removeShitFromDOM() {
  const videos = document.querySelector("#secondary");
  if (videos) {
    videos.remove();
  }
}

function cleanUp() {
  removeShitFromDOM();

  const items = [...Array.from(document.querySelectorAll('a[href="/"]'))] as HTMLAnchorElement[];

  items.forEach(
    (item: HTMLAnchorElement) => {
      item.href = REDIRECT_URL;
      item.onmousedown = () => {
        document.location.href = REDIRECT_URL;
      };
    }
  );
}

cleanUp();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === "remove_sugested") {
    console.log("clean sugested");
    cleanUp();
    sendResponse(true);
  }
});
