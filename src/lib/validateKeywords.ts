import { Filter } from "bad-words";

export const validateStoryPrompt = (storyPrompt: string): string | null => {
  const filter = new Filter();
  const trimmed = storyPrompt.trim();

  // 1. Empty input
  if (!trimmed) return "Please enter some keywords to generate a story.";

  // 2. Split into keywords
  const keywords = trimmed
    .split(/[,\s]+/) // split by comma or space
    .filter((word) => word.length > 0);

  // 3. Minimum and maximum count
  if (keywords.length < 2)
    return "Please enter at least 2 keywords for a meaningful story.";
  if (keywords.length > 8)
    return "Please limit your keywords to 8 or fewer.";

  // 4. Check for too short or gibberish words
  const shortWords = keywords.filter((w) => w.length < 2);
  if (shortWords.length > 0)
    return `Please remove very short keywords like: ${shortWords.join(", ")}.`;

  // 5. Only letters and spaces allowed
  const invalidWords = keywords.filter((w) => !/^[a-zA-Z]+$/.test(w));
  if (invalidWords.length > 0)
    return `Please remove invalid characters from: ${invalidWords.join(", ")}.`;

  // 6. Profanity filter
  if (filter.isProfane(trimmed))
    return "Please remove inappropriate or offensive words.";

  // 7. Duplicate words
  const unique = new Set(keywords);
  if (unique.size < keywords.length)
    return "Please use unique keywords instead of repeating the same word.";

  return null; // ✅ all good
};
