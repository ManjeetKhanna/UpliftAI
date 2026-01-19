// backend/src/services/sentimentService.js

export function analyzeMessage(text = "") {
  const lower = text.toLowerCase();

  // sentiment
  let sentiment = "neutral";
  if (
    lower.includes("stress") ||
    lower.includes("stressed") ||
    lower.includes("estres") ||
    lower.includes("estresado") ||
    lower.includes("anxious") ||
    lower.includes("overwhelmed")
  ) {
    sentiment = "negative";
  } else if (
    lower.includes("motivated") ||
    lower.includes("motivation") ||
    lower.includes("motivado") ||
    lower.includes("happy") ||
    lower.includes("confident")
  ) {
    sentiment = "positive";
  }

  // category
  let category = "General";
  if (
    lower.includes("stress") ||
    lower.includes("stressed") ||
    lower.includes("estres") ||
    lower.includes("estresado") ||
    lower.includes("anxious") ||
    lower.includes("overwhelmed")
  ) {
    category = "Stress";
  } else if (lower.includes("work") || lower.includes("job") || lower.includes("trabajo")) {
    category = "Workload";
  } else if (lower.includes("motivation") || lower.includes("motivated") || lower.includes("motivado")) {
    category = "Motivation";
  }

  return { sentiment, category };
}
