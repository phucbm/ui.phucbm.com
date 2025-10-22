export function splitTextIntoWords(paragraph: Element, keywords: string[]) {
    if (!paragraph) return [];
  
    const text = paragraph.textContent || "";
    const words = text.split(/(\s+)/); // keep spaces
    const html = words
      .map((word) => {
        if (!word.trim()) return word; // preserve spaces
  
        const normalized = word.toLowerCase().replace(/[.,!?;:"]/g, "");
        const isKeyword = keywords.includes(normalized);
        const keywordClass = isKeyword ? " keyword-wrapper" : "";
        const textClass = isKeyword ? `word-text keyword ${normalized}` : "word-text";
  
        return `
          <div class="word inline-block relative mr-1 mb-1 px-1 py-0.5 rounded-full${keywordClass}">
            <span class="${textClass}">${word}</span>
          </div>
        `;
      })
      .join("");
  
    paragraph.innerHTML = html;
    return Array.from(paragraph.querySelectorAll<HTMLElement>(".word"));
  }