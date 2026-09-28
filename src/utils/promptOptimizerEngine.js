import { detectDomain, detectIntent } from './nlpEngine.js';

/**
 * Evaluates quality metrics for any prompt text
 */
export const evaluatePromptQuality = (prompt) => {
  if (!prompt || prompt.trim().length === 0) {
    return { clarity: 0, context: 0, structure: 0, specificity: 0, overallScore: 0, flaws: [] };
  }

  const text = prompt.trim();
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;
  const flaws = [];

  // 1. Structure Score
  let structure = 40;
  if (text.includes("[ROLE]") || text.includes("ROLE:") || text.includes("Role:")) structure += 15;
  if (text.includes("[TASK]") || text.includes("TASK:") || text.includes("Task:")) structure += 15;
  if (text.includes("[CONSTRAINTS]") || text.includes("CONSTRAINTS:")) structure += 15;
  if (text.includes("[OUTPUT]") || text.includes("EXPECTED OUTPUT:") || text.includes("Format:")) structure += 15;
  if (text.includes("\n") || text.includes("- ")) structure += 10;
  structure = Math.min(100, structure);

  if (structure < 60) flaws.push({ type: "Structure", text: "Missing clear section headers (e.g., [ROLE], [TASK], [CONSTRAINTS])." });

  // 2. Context Score
  let context = 35;
  if (wordCount > 15) context += 20;
  if (wordCount > 35) context += 25;
  if (lower.includes("background") || lower.includes("context") || lower.includes("target") || lower.includes("scenario") || lower.includes("for")) context += 20;
  context = Math.min(100, context);

  if (context < 60) flaws.push({ type: "Context", text: "Lacks sufficient background scenario or target use-case context." });

  // 3. Clarity Score
  let clarity = 50;
  if (lower.startsWith("act as") || lower.startsWith("you are") || lower.startsWith("as a")) clarity += 20;
  if (!lower.includes("maybe") && !lower.includes("stuff") && !lower.includes("things") && !lower.includes("etc")) clarity += 20;
  if (wordCount >= 10 && wordCount <= 250) clarity += 10;
  clarity = Math.min(100, clarity);

  if (!lower.startsWith("act as") && !lower.startsWith("you are") && !lower.startsWith("as a")) {
    flaws.push({ type: "Clarity", text: "Unclear persona or expert role definition at the beginning." });
  }

  // 4. Specificity Score
  let specificity = 30;
  if (lower.includes("don't") || lower.includes("do not") || lower.includes("must") || lower.includes("only") || lower.includes("limit")) specificity += 25;
  if (lower.includes("json") || lower.includes("markdown") || lower.includes("table") || lower.includes("bullet") || lower.includes("format")) specificity += 25;
  if (/\d+/.test(text)) specificity += 20;
  specificity = Math.min(100, specificity);

  if (specificity < 60) flaws.push({ type: "Specificity", text: "No precise output format guidelines or negative constraints specified." });

  const overallScore = Math.round((clarity * 0.25) + (context * 0.25) + (structure * 0.25) + (specificity * 0.25));

  return {
    clarity,
    context,
    structure,
    specificity,
    overallScore,
    flaws
  };
};

/**
 * Optimizes an existing prompt into a high-quality, structured framework
 */
export const optimizePrompt = (originalPrompt) => {
  if (!originalPrompt || originalPrompt.trim().length === 0) {
    return {
      optimizedText: "",
      originalScore: 0,
      optimizedScore: 0,
      improvementsApplied: []
    };
  }

  const raw = originalPrompt.trim();
  const domain = detectDomain(raw);
  const intent = detectIntent(raw);
  const evalBefore = evaluatePromptQuality(raw);

  const improvementsApplied = [];

  // Determine Expert Persona
  let rolePersona = "Subject Matter Expert";
  if (domain === "Software Development") rolePersona = "Senior Principal Software Architect";
  else if (domain === "Data Science") rolePersona = "Lead Data Scientist and ML Architect";
  else if (domain === "Marketing") rolePersona = "Chief Marketing Officer (CMO) & Copywriting Lead";
  else if (domain === "Business") rolePersona = "Enterprise Strategy Consultant and Tech Lead";
  else if (domain === "Finance") rolePersona = "Senior Financial Analyst and Portfolio Advisor";
  else if (domain === "HR") rolePersona = "Director of Human Resources & Talent Acquisition";
  else if (domain === "Content Creation") rolePersona = "Viral Content Strategist and Editor-in-Chief";
  else if (domain === "Research") rolePersona = "Lead Academic Researcher and Peer Reviewer";

  improvementsApplied.push(`Assigned explicit persona: "${rolePersona}"`);

  // Extract core goal
  const cleanGoal = raw
    .replace(/^(can you|please|i want to|i need to|help me|make a|create a|generate a|write a)\s+/i, "")
    .replace(/\.$/, "");

  const uppercaseFirst = cleanGoal.charAt(0).toUpperCase() + cleanGoal.slice(1);

  // Construct structured optimized prompt
  const optimizedText = `[ROLE]
Act as a ${rolePersona} with deep expertise in ${domain}.

[OBJECTIVE]
${uppercaseFirst}.

[CONTEXT]
The goal is to deliver production-ready, highly effective results for ${intent.toLowerCase()}. High accuracy, depth, and actionable execution are essential.

[TASK]
1. Thoroughly analyze the requirement and identify key parameters.
2. Provide a structured, step-by-step breakdown or solution.
3. Include concrete examples, best practices, and edge-case handling.

[CONSTRAINTS]
- Avoid generic filler text; provide specific, high-value content.
- Adhere strictly to industry standards and accurate terminology.
- State assumptions clearly if additional input is needed.

[EXPECTED OUTPUT]
Provide the response formatted in clean Markdown with clear headings, bullet points, and code blocks (where applicable).`;

  improvementsApplied.push("Added structured framework sections: [ROLE], [OBJECTIVE], [CONTEXT], [TASK], [CONSTRAINTS], [EXPECTED OUTPUT]");
  improvementsApplied.push("Injected strict quality constraints to eliminate generic AI responses");
  improvementsApplied.push("Standardized output format specification to clean Markdown");

  const evalAfter = evaluatePromptQuality(optimizedText);

  return {
    originalText: raw,
    optimizedText,
    originalMetrics: evalBefore,
    optimizedMetrics: evalAfter,
    improvementsApplied
  };
};
