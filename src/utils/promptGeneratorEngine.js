import { detectDomain, detectIntent, extractEntities } from './nlpEngine.js';

/**
 * Builds a structured, production-ready AI Prompt based on requirement + parameters
 */
export const generateStructuredPrompt = (config) => {
  const {
    requirement = "",
    domain: userDomain = "",
    outputType: userOutputType = "",
    tone: userTone = "",
    targetAudience = "",
    constraints = "",
    context: userContext = ""
  } = config;

  if (!requirement || requirement.trim().length === 0) {
    return "";
  }

  // 1. Domain Detection
  const finalDomain = userDomain && userDomain !== "Auto Detect" 
    ? userDomain 
    : detectDomain(requirement);

  // 2. Intent Detection
  const intent = detectIntent(requirement);

  // 3. Entity & Extracted Format/Tone
  const nlpEntities = extractEntities(requirement);
  const finalTone = userTone || nlpEntities.detectedTone || "Professional & Authoritative";
  const finalOutputType = userOutputType || nlpEntities.detectedFormat || "Markdown with Headings & Bullet Points";

  // 4. Expert Role Mapping
  let roleTitle = "Principal Subject Matter Expert";
  if (finalDomain === "Software Development") roleTitle = "Senior Staff Software Engineer & Solutions Architect";
  else if (finalDomain === "Data Science") roleTitle = "Lead Machine Learning & Data Science Specialist";
  else if (finalDomain === "Marketing") roleTitle = "Chief Marketing Officer (CMO) & Brand Strategist";
  else if (finalDomain === "Business") roleTitle = "Enterprise Business Strategy Consultant";
  else if (finalDomain === "Finance") roleTitle = "Senior Financial Analyst & Investment Strategist";
  else if (finalDomain === "HR") roleTitle = "VP of Human Resources & Organizational Development";
  else if (finalDomain === "Content Creation") roleTitle = "Expert Copywriter & Senior Content Editor";
  else if (finalDomain === "Research") roleTitle = "Lead Academic Researcher & Technical Writer";

  // Clean objective
  const cleanObj = requirement.trim();

  // Construct sections
  const sectionRole = `[ROLE]\nAct as a ${roleTitle} with specialized expertise in ${finalDomain}. Adhere to a ${finalTone} tone.`;
  
  const sectionObjective = `[OBJECTIVE]\nYour primary goal is to address the following requirement:\n"${cleanObj}"`;

  const sectionContext = `[CONTEXT]\n${userContext ? userContext.trim() : `This task is designed for ${targetAudience ? targetAudience.trim() : 'professional decision-makers and stakeholders'} operating in the ${finalDomain} domain. High technical accuracy, strategic depth, and practical utility are required.`}`;

  const sectionTask = `[TASK]\n1. Conduct a brief preliminary analysis of the requirement.\n2. Develop a step-by-step framework to execute the requirement effectively.\n3. Provide concrete details, actionable recommendations, and edge-case considerations.\n4. Address target audience needs: ${targetAudience || 'General Professional Audience'}.`;

  const userConstraintsList = constraints ? constraints.split('\n').filter(c => c.trim()).map(c => `- ${c.trim()}`) : [];
  const defaultConstraints = [
    "- Do not output generic advice or unverified placeholders.",
    "- Ensure all code, data, or steps adhere strictly to modern best practices.",
    "- Maintain consistent terminology throughout."
  ];

  const sectionConstraints = `[CONSTRAINTS]\n${[...userConstraintsList, ...defaultConstraints].join('\n')}`;

  const sectionExpectedOutput = `[EXPECTED OUTPUT]\nProvide your response formatted as: ${finalOutputType}.\nStructure the output using clear H2/H3 section headers, tables, bullet points, or syntax-highlighted code snippets where appropriate.`;

  return `${sectionRole}\n\n${sectionObjective}\n\n${sectionContext}\n\n${sectionTask}\n\n${sectionConstraints}\n\n${sectionExpectedOutput}`;
};
