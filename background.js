// console.log('running');

const REDIRECT_URL = "https://www.youtube.com/feed/subscriptions";

var bkg = chrome.extension.getBackgroundPage();
bkg.console.log("Background script running");

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log(details);
    return {
      redirectUrl: REDIRECT_URL
    };
  },
  {
    urls: ["*://*.youtube.com/"],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "object",
      "xmlhttprequest",
      "other"
    ]
  },
  ["blocking"]
);

function check_home(url) {
  const beg_url = url[0];
  return beg_url === "www.youtube.com/";
}

function check_video(url) {
  const beg_url = url[0];
  return beg_url.substr(0, 24) === "www.youtube.com/watch?v=";
}

function clean_url(url) {
  return url.split("://").splice(1);
}

function get_page(url) {
  const clean = clean_url(url);

  if (clean) {
    if (check_home(clean)) {
      return 1; // home page
    } else if (check_video(clean)) {
      return 2; // video page
    } else {
      return 0; // somewhere
    }
  }
  return -1;
}

function remove_sugested(tabId) {
  chrome.tabs.sendMessage(
    tabId,
    {
      text: "remove_sugested"
    }
  );
}

function run(url, tabId) {
  const page = get_page(url);

  if (page !== -1) {
    if (page === 1) {
      // redirect
      chrome.tabs.update(tabId, { url: REDIRECT_URL });
    } else if (page === 2) {
      // remove sugested
      remove_sugested(tabId);
    }
  }
}

chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  const { url, tabId } = details;
  run(url, tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  run(tab.url, tabId);
});
