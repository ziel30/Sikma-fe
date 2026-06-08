/**
 * Parse the correct numeric answer from a question string.
 * Handles all formats produced by our question templates.
 */
export function parseQuestion(question: string): number {
  let expr = question.replace(/\s*=\s*\?$/, "").trim();

  // "40% dari 60"
  const pct = expr.match(/^(\d+(\.\d+)?)%\s+dari\s+(\d+(\.\d+)?)$/);
  if (pct) return (Number(pct[1]) / 100) * Number(pct[3]);

  // "√25"
  if (expr.startsWith("√")) return Math.sqrt(Number(expr.slice(1).trim()));

  // Replace math symbols → JS operators, then eval
  expr = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/(\d+)³/g, "($1*$1*$1)")
    .replace(/(\d+)²/g, "($1*$1)");

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return +(${expr}).toFixed(4)`)();
    return Number(result);
  } catch {
    return 0;
  }
}

/** Generate 4 multiple-choice options (1 correct + 3 plausible wrongs). */
export function generateOptions(correct: number): {
  options: string[];
  answerIndex: number;
} {
  const candidates = new Set<number>();

  const deltas = [-1, 1, -2, 2, -3, 3, -5, 5, -4, 4, -10, 10];
  for (const d of deltas.sort(() => Math.random() - 0.5)) {
    const c = Math.round(correct + d);
    if (c !== correct && c >= 0) candidates.add(c);
    if (candidates.size >= 3) break;
  }

  while (candidates.size < 3) {
    const delta = Math.floor(Math.random() * 20) + 1;
    const c = Math.random() < 0.5 ? correct + delta : Math.abs(correct - delta);
    if (c !== correct) candidates.add(Math.round(c));
  }

  const all = [correct, ...Array.from(candidates)].sort(() => Math.random() - 0.5);
  return { options: all.map(String), answerIndex: all.indexOf(correct) };
}
