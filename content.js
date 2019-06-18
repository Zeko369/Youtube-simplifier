// var a = document.getElementById('secondary');
// a.parentNode.removeChild(a);

const REDIRECT_URL = "https://www.youtube.com/feed/subscriptions";

// function check_home() {
//   const url = document.location.href.split('://');
//   const beg_url = url.splice(1, 1)[0];
//   console.log(beg_url);
//   if(beg_url === 'www.youtube.com/') {
//     document.location.href = REDIRECT_URL;
//   }
// }

function removeShitFromDOM() {
  const videos = document.querySelector("#secondary");
  if (videos) {
    videos.remove();
  }
}

function cleanUp() {
  removeShitFromDOM();
  console.log("foobar");
  document.querySelectorAll('a[href="/"]').forEach(item => {
    item.href = REDIRECT_URL;
    item.onmousedown = () => {
      document.location.href = REDIRECT_URL;
    };
  });
}

cleanUp();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === "remove_sugested") {
    // check_home();
    // console.log(msg.text);
    console.log("clean sugested");
    cleanUp();
    sendResponse(true);
  }
});
