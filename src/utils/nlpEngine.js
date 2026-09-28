// NLP Analysis Engine: Keyword Extraction, Intent Detection, Domain Classification, Cosine Similarity & Context Evaluation

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", 
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "can't", "cannot", 
  "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", 
  "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", 
  "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", 
  "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", 
  "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", 
  "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", 
  "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", 
  "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", 
  "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", 
  "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", 
  "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", 
  "you've", "your", "yours", "yourself", "yourselves", "need", "want", "create", "generate", "write", "make", "build"
]);

const DOMAIN_KEYWORD_MAP = {
  "Software Development": ["code", "refactor", "python", "react", "api", "devops", "database", "git", "sql", "bug", "testing", "endpoint", "java", "javascript", "typescript", "architecture", "docker", "function", "backend", "frontend", "class", "microservices"],
  "Data Science": ["pandas", "machine learning", "dataset", "model", "python", "feature", "eda", "neural", "analytics", "classification", "regression", "data", "scikit", "huggingface", "prediction", "tensorflow", "pytorch", "algorithm"],
  "Marketing": ["campaign", "email", "strategy", "launch", "brand", "seo", "social media", "copy", "leads", "marketing", "funnel", "conversion", "sales", "ads", "target", "audience", "positioning"],
  "Business": ["pitch", "startup", "revenue", "finance", "budget", "competitor", "enterprise", "business", "strategy", "roadmap", "investor", "valuation", "moat", "b2b", "market", "roi"],
  "Finance": ["tax", "budget", "investment", "audit", "stock", "portfolio", "crypto", "banking", "accounting", "asset", "liability", "dividend", "financial", "equity"],
  "HR": ["interview", "recruitment", "employee", "resume", "onboarding", "hiring", "feedback", "policy", "candidate", "performance", "culture", "talent"],
  "Content Creation": ["blog", "article", "youtube", "linkedin", "story", "script", "post", "content", "newsletter", "copywriting", "headline", "hook", "draft"],
  "Research": ["paper", "academic", "methodology", "literature", "thesis", "study", "citation", "hypothesis", "journal", "experiment", "findings", "survey"],
  "Customer Support": ["ticket", "response", "customer", "complaint", "inquiry", "resolution", "refund", "email", "support", "faq", "satisfaction", "client"],
  "Education": ["curriculum", "lesson", "quiz", "student", "exam", "tutorial", "explanation", "course", "teaching", "syllabus", "grade", "assignment"]
};

/**
 * Tokenize and normalize text into clean words
 */
export const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
};

/**
 * Extract top keywords with weights
 */
export const extractKeywords = (text, topN = 8) => {
  const tokens = tokenize(text);
  if (tokens.length === 0) return [];

  const freq = {};
  tokens.forEach(t => {
    freq[t] = (freq[t] || 0) + 1;
  });

  const sorted = Object.keys(freq)
    .map(word => ({ keyword: word, count: freq[word], weight: Math.min(100, Math.round((freq[word] / tokens.length) * 100 * 3)) }))
    .sort((a, b) => b.count - a.count);

  return sorted.slice(0, topN);
};

/**
 * Detect Domain based on keyword vector matching
 */
export const detectDomain = (text) => {
  const tokens = tokenize(text);
  if (tokens.length === 0) return "General AI";

  const domainScores = {};
  Object.keys(DOMAIN_KEYWORD_MAP).forEach(domain => {
    domainScores[domain] = 0;
    const keywords = DOMAIN_KEYWORD_MAP[domain];
    tokens.forEach(token => {
      if (keywords.includes(token)) {
        domainScores[domain] += 2;
      }
    });
  });

  let maxScore = 0;
  let bestDomain = "General AI";
  Object.keys(domainScores).forEach(domain => {
    if (domainScores[domain] > maxScore) {
      maxScore = domainScores[domain];
      bestDomain = domain;
    }
  });

  return bestDomain;
};

/**
 * Detect Intent of requirement
 */
export const detectIntent = (text) => {
  const lower = text.toLowerCase();
  
  if (lower.includes("code") || lower.includes("build") || lower.includes("develop") || lower.includes("script") || lower.includes("refactor")) {
    return "Code Generation & Implementation";
  }
  if (lower.includes("strategy") || lower.includes("plan") || lower.includes("launch") || lower.includes("roadmap")) {
    return "Strategic Planning";
  }
  if (lower.includes("optimize") || lower.includes("improve") || lower.includes("enhance") || lower.includes("speed up")) {
    return "Optimization & Refactoring";
  }
  if (lower.includes("analyze") || lower.includes("data") || lower.includes("eda") || lower.includes("report")) {
    return "Data Analysis & Insights";
  }
  if (lower.includes("write") || lower.includes("copy") || lower.includes("email") || lower.includes("article") || lower.includes("post")) {
    return "Content & Copywriting";
  }
  if (lower.includes("fix") || lower.includes("debug") || lower.includes("error") || lower.includes("issue")) {
    return "Troubleshooting & Debugging";
  }
  if (lower.includes("explain") || lower.includes("teach") || lower.includes("how to") || lower.includes("summary")) {
    return "Educational & Explanation";
  }

  return "General Assistant Task";
};

/**
 * Extract entities and explicit parameters from user prompt
 */
export const extractEntities = (text) => {
  const lower = text.toLowerCase();
  
  // Format check
  let format = "Standard Paragraph";
  if (lower.includes("json")) format = "JSON Schema";
  else if (lower.includes("table")) format = "Markdown Table";
  else if (lower.includes("bullet") || lower.includes("list")) format = "Bullet Points";
  else if (lower.includes("step by step") || lower.includes("steps")) format = "Step-by-Step Guide";
  else if (lower.includes("code")) format = "Code Block";

  // Tone check
  let tone = "Professional";
  if (lower.includes("concise") || lower.includes("short")) tone = "Concise";
  else if (lower.includes("creative") || lower.includes("engaging")) tone = "Creative & Engaging";
  else if (lower.includes("academic") || lower.includes("scientific")) tone = "Academic";
  else if (lower.includes("technical") || lower.includes("detailed")) tone = "Technical & Thorough";

  return {
    detectedFormat: format,
    detectedTone: tone
  };
};

/**
 * Cosine Similarity calculation using TF-IDF word vectors
 */
export const calculateCosineSimilarity = (str1, str2) => {
  const tokens1 = tokenize(str1);
  const tokens2 = tokenize(str2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const vocab = Array.from(new Set([...tokens1, ...tokens2]));
  const vec1 = vocab.map(w => tokens1.filter(t => t === w).length);
  const vec2 = vocab.map(w => tokens2.filter(t => t === w).length);

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vocab.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;

  const sim = (dotProduct / (mag1 * mag2)) * 100;
  return Math.min(99, Math.max(0, Math.round(sim)));
};

/**
 * Find top similar prompts from active CSV dataset
 */
export const findSimilarPrompts = (requirement, datasetRows, promptCol = "prompt_text", topN = 4) => {
  if (!requirement || !datasetRows || datasetRows.length === 0) return [];

  const scored = datasetRows.map(item => {
    const pText = item[promptCol] || item.prompt_text || item.text || "";
    const score = calculateCosineSimilarity(requirement, pText);
    return {
      ...item,
      similarityScore: score,
      promptSnippet: pText
    };
  });

  return scored
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, topN);
};

/**
 * Full NLP Analysis suite
 */
export const analyzeRequirementNLP = (text, datasetRows = [], promptCol = "prompt_text") => {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const keywords = extractKeywords(text, 10);
  const domain = detectDomain(text);
  const intent = detectIntent(text);
  const entities = extractEntities(text);
  const similarPrompts = findSimilarPrompts(text, datasetRows, promptCol, 4);

  // Missing info analysis
  const wordCount = text.trim().split(/\s+/).length;
  const missingContext = [];
  if (wordCount < 6) missingContext.push("Requirement is very short. Add specific goals or context.");
  if (!text.toLowerCase().includes("as a") && !text.toLowerCase().includes("role")) missingContext.push("Missing persona/role declaration.");
  if (!entities.detectedFormat || entities.detectedFormat === "Standard Paragraph") missingContext.push("Output format not explicitly specified.");
  if (!text.toLowerCase().includes("don't") && !text.toLowerCase().includes("not") && !text.toLowerCase().includes("constraint") && !text.toLowerCase().includes("limit")) {
    missingContext.push("No explicit constraints or boundaries provided.");
  }

  return {
    inputText: text,
    wordCount,
    charCount: text.length,
    keywords,
    detectedDomain: domain,
    detectedIntent: intent,
    entities,
    similarPrompts,
    missingContext,
    clarityRating: Math.min(100, Math.max(30, Math.round((wordCount / 20) * 100)))
  };
};
