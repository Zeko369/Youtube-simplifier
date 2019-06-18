import { check_home, check_video } from "./utils/urlChecks.js";

const REDIRECT_FROM_HOME = false;

const bkg = chrome.extension.getBackgroundPage();
if (bkg) {
  bkg.console.log("Background script running");
}

if (REDIRECT_FROM_HOME) {
  chrome.webRequest.onBeforeRequest.addListener(
    details => {
      console.log(details);
      return {
        redirectUrl: "https://www.youtube.com/feed/subscriptions"
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
}

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

function send_change_home(tabId: number) {
  chrome.tabs.sendMessage(tabId, {
    text: "change_home"
  });
}

function run(url: string, tabId: number) {
  const action = get_action(url);

  if (action !== -1) {
    if (action === 1) {
      console.log("Foo");
      // redirect
      if(REDIRECT_FROM_HOME) {
        chrome.tabs.update(tabId, { url: "https://www.youtube.com/feed/subscriptions" });
      } else {
        send_change_home(tabId);
      }
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
