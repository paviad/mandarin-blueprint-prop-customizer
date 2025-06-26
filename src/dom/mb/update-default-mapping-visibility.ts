
export function updateDefaultMappingVisibility(hideDefault: boolean) {
  const spans = Array.from(
    document.querySelectorAll("span[data-mbc-default]")
  ) as HTMLSpanElement[];
  for (const span of spans) {
    const char = span.getAttribute("data-mbc-char");
    const defaultText = span.getAttribute("data-mbc-default") || "";
    if (hideDefault) {
      span.title = `Default: ${defaultText}`;
      span.innerText = char || "";
    } else {
      span.title = "";
      span.innerText = defaultText;
    }
  }
}
