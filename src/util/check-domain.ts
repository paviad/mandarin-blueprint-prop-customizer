export function isMb() {
  const url = window.location.href;
  return url.startsWith("https://courses.mandarinblueprint.com/");
}

export function isTraverse() {
  const url = window.location.href;
  return url.startsWith("https://traverse.link/");
}
