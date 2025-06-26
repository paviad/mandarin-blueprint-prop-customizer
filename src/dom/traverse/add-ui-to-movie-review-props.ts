import { addMappingUi } from '../add-mapping-ui';


export async function addUiToMovieReviewProps() {
  const spans = Array.from(document.querySelectorAll("span"));

  const propSpans = spans
    .map((span) => {
      const a = span.querySelector("a");
      if (!a || a.parentElement !== span) return [null, ""] as const;
      const textContent = a.textContent?.trim() || "";

      const match = textContent.match(
        /^([\u2e80-\u2eff\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u{20000}-\u{2a6d6}]).*?PROP/u
      );

      if (!match) return [null, ""] as const;

      const r = [span, match?.[1] || ""] as const;
      return r;
    })
    .filter(([span]) => Boolean(span)) as [HTMLSpanElement, string][];

  for (const [span, chineseChar] of propSpans) {
    addMappingUi(chineseChar, span);
  }
}
