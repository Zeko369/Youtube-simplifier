export function check_home(url: string) {
  return clean_url(url) === "www.youtube.com/";
}

export function check_video(url: string) {
  return clean_url(url).substr(0, 24) === "www.youtube.com/watch?v=";
}

function clean_url(url: string) {
  return url
    .split("://")
    .splice(1)
    .join("");
}