export function splitTextIntoWords(paragraph: Element, keywords: string[]) {
  if (!paragraph) return [];

  const text = paragraph.textContent || "";
  const words = text.split(/(\s+)/); // keep spaces

  const html = words
    .map((word) => {
      if (!word.trim()) return word; // preserve spaces

      const normalized = word.toLowerCase().replace(/[.,!?;:"]/g, "");
      const isKeyword = keywords.includes(normalized);

      const textClass = isKeyword
        ? `word-text keyword ${normalized} inline-block w-full h-full rounded-2xl py-[0.1rem] text-[#141414] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[calc(100%+1rem)] before:h-[calc(100%+2rem)] before:bg-white before:rounded-2xl before:-z-10 opacity-0`
        : `word-text relative opacity-0`;

      const wrapperClass = isKeyword ? "keyword-wrapper" : "";

      return `
        <div class="word inline-block relative mr-[0.2rem] mb-[0.2rem] px-[0.2rem] py-[0.1rem] rounded-2xl will-change-[background-color,opacity] opacity-0 ${wrapperClass}">
          <span class="${textClass}">${word}</span>
        </div>
      `;
    })
    .join("");

  // Hide paragraph before animation (like visibility: hidden)
  (paragraph as HTMLElement).classList.add("invisible");

  paragraph.innerHTML = html;

  return Array.from(paragraph.querySelectorAll<HTMLElement>(".word"));
}
