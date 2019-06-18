import { check_home, check_video } from "./utils/urlChecks";

const REDIRECT_URL = "https://www.youtube.com/feed/subscriptions";

const bkg = chrome.extension.getBackgroundPage();
if (bkg) {
  bkg.console.log("Background script running");
}

chrome.webRequest.onBeforeRequest.addListener(
  details => {
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

function get_action(url: string) {
  if (url) {
    if (check_home(url)) {
      return 1; // home page
    } else if (check_video(url)) {
      return 2; // video page
    } else {
      return 0; // somewhere
    }
  }
  return -1;
}

function remove_sugested(tabId: number) {
  chrome.tabs.sendMessage(tabId, {
    text: "remove_sugested"
  });
}

function run(url: string, tabId: number) {
  const action = get_action(url);

  if (action !== -1) {
    if (action === 1) {
      // redirect
      chrome.tabs.update(tabId, { url: REDIRECT_URL });
    } else if (action === 2) {
      // remove sugested
      remove_sugested(tabId);
    }
  }
}

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    const { url, tabId } = details;
    run(url, tabId);
  }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    run(tab.url, tabId);
  }
});
