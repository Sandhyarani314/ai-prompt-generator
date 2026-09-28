import { analyzeRequirementNLP } from '../utils/nlpEngine.js';
import { generateStructuredPrompt } from '../utils/promptGeneratorEngine.js';
import { optimizePrompt } from '../utils/promptOptimizerEngine.js';

/**
 * Service layer for LLM Integration and Multi-Stage Pipeline Execution
 */

export const executeLLMPipeline = async (config, datasetRows, promptCol, settings, onProgress) => {
  const { requirement } = config;

  if (!requirement || requirement.trim().length === 0) {
    throw new Error("Requirement cannot be empty.");
  }

  // Helper for step delay and progress notification
  const notifyStep = async (message, stepIndex, totalSteps = 5) => {
    if (onProgress) {
      onProgress({ message, stepIndex, totalSteps });
    }
    // Artificial small delay for visual demonstration smooth workflow
    await new Promise(resolve => setTimeout(resolve, 400));
  };

  try {
    // Step 1: Analyzing...
    await notifyStep("Analyzing requirement with NLP...", 1);
    const nlpResult = analyzeRequirementNLP(requirement, datasetRows, promptCol);

    // Step 2: Searching CSV dataset recommendations...
    await notifyStep("Searching CSV dataset for matching prompts...", 2);
    const similarPrompts = nlpResult?.similarPrompts || [];

    // Step 3: Generating structured prompt...
    await notifyStep("Generating structured prompt template...", 3);
    const initialPrompt = generateStructuredPrompt({
      ...config,
      domain: config.domain || nlpResult?.detectedDomain
    });

    // Step 4: Enhancing with LLM...
    await notifyStep("Enhancing prompt with AI / LLM reasoning...", 4);
    let enhancedPrompt = initialPrompt;

    // Check if user has configured external API in Settings (e.g. OpenAI / Groq / Gemini)
    if (settings && settings.apiKey && settings.apiKey.trim().length > 0) {
      enhancedPrompt = await callExternalLLMAPI(initialPrompt, settings);
    } else {
      // Local Intelligent Simulation Engine
      enhancedPrompt = simulateLLMEnhancement(initialPrompt, config, nlpResult);
    }

    // Step 5: Optimizing & Finalizing...
    await notifyStep("Optimizing structure and clarity scores...", 5);
    const optimization = optimizePrompt(enhancedPrompt);

    await notifyStep("Completed", 5);

    return {
      success: true,
      nlpResult,
      similarPrompts,
      initialPrompt,
      enhancedPrompt: optimization.optimizedText,
      optimization,
      domain: config.domain || nlpResult?.detectedDomain || "General AI"
    };

  } catch (error) {
    console.error("LLM Pipeline Error:", error);
    throw new Error(error.message || "An error occurred while processing the AI prompt pipeline.");
  }
};

/**
 * Calls external API (OpenAI / Groq / Gemini compatible endpoint)
 */
async function callExternalLLMAPI(promptText, settings) {
  const apiKey = settings.apiKey;
  const endpoint = settings.apiEndpoint || "https://api.openai.com/v1/chat/completions";
  const model = settings.model || "gpt-3.5-turbo";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an expert AI Prompt Engineer. Take the structured prompt draft and enhance it for maximum precision, role clarity, and LLM execution capability. Output ONLY the enhanced prompt."
        },
        {
          role: "user",
          content: promptText
        }
      ],
      temperature: settings.temperature || 0.7
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `LLM API call failed with status ${response.status}.`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || promptText;
}

/**
 * Local AI / LLM Simulation Engine for offline / demonstration mode
 */
function simulateLLMEnhancement(promptText, config, nlpResult) {
  // Enhances the generated prompt with specific contextual refinements
  const domain = config.domain || nlpResult?.detectedDomain || "General AI";
  
  if (promptText.includes("[LLM ENHANCED]")) {
    return promptText;
  }

  // Inject LLM intelligence enhancements
  let enhanced = promptText;
  
  // Add domain-specific prompt engineering tips
  const llmAddendum = `\n\n[FEW-SHOT EXAMPLES & VERIFICATION]\n- Verify that step 1 aligns with ${domain} industry standards.\n- Ensure output includes self-correction logic and fallback handling if input parameters are incomplete.`;
  
  return enhanced + llmAddendum;
}
