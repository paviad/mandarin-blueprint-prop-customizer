export function replaceMappingInUi(char: string, newVal: string) {
  const elements = document.querySelectorAll(`[mbc-data-hanzi="${char}"]`);
  elements.forEach((text) => {
    if (text) {
      if (newVal) {
        text.textContent = `Mapped: ${newVal}`;
      } else {
        text.textContent = `(Not Mapped)`;
      }
    }
  });
}
