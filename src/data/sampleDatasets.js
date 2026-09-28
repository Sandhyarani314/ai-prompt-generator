// Default curated CSV datasets loaded into the application state

export const INITIAL_DATASETS = [
  {
    id: "dataset-software-ai",
    name: "Software & AI Engineering Prompts.csv",
    uploadDate: "2026-09-28",
    rowCount: 24,
    columnCount: 6,
    detectedPromptCol: "prompt_text",
    domain: "Software Development",
    stats: {
      totalPrompts: 24,
      uniquePrompts: 24,
      domainsCount: 3,
      missingValues: 0,
      duplicateRecords: 0,
      avgPromptLength: 285
    },
    data: [
      {
        id: "sw-1",
        title: "Python Code Refactoring & Optimization",
        prompt_text: "Act as a Senior Python Software Architect. Refactor the following Python code for maximum readability, memory efficiency, and execution speed. Apply PEP8 standards, add type hints, clean docstrings, and handle edge-case exceptions gracefully.",
        domain: "Software Development",
        intent: "Code Generation",
        complexity: "Advanced",
        tags: "Python, Refactoring, Clean Code"
      },
      {
        id: "sw-2",
        title: "REST API Endpoint Design Specification",
        prompt_text: "Act as a Principal API Architect. Design a production-ready RESTful API specification for a microservices system. Include exact endpoints, HTTP methods, JSON request/response payloads, status codes, authentication headers, and error handling structure.",
        domain: "Software Development",
        intent: "System Design",
        complexity: "Intermediate",
        tags: "API, REST, Microservices"
      },
      {
        id: "sw-3",
        title: "Jest & React Testing Library Unit Tests",
        prompt_text: "Act as a Senior Frontend QA Engineer. Write comprehensive unit and integration tests using Jest and React Testing Library for the provided React component. Cover happy path, edge cases, user interactions, loading states, and mock API calls.",
        domain: "Software Development",
        intent: "Testing",
        complexity: "Intermediate",
        tags: "React, Testing, Jest"
      },
      {
        id: "sw-4",
        title: "SQL Query Performance & Index Optimizer",
        prompt_text: "Act as a Database Administrator (DBA). Analyze the provided slow SQL query. Provide an optimized rewrite using appropriate JOINs, indexing strategies, CTEs, and execution plan explanations to reduce query latency by at least 70%.",
        domain: "Software Development",
        intent: "Optimization",
        complexity: "Advanced",
        tags: "SQL, Database, Optimization"
      },
      {
        id: "sw-5",
        title: "Production Dockerfile Multi-Stage Build",
        prompt_text: "Act as a Senior DevOps Lead. Construct an optimized multi-stage Dockerfile for a Node.js / React application. Ensure minimal final image footprint (<100MB), non-root security context, caching layer optimization, and explicit environment variables.",
        domain: "Software Development",
        intent: "DevOps",
        complexity: "Advanced",
        tags: "Docker, DevOps, Security"
      },
      {
        id: "sw-6",
        title: "Interactive System Architecture Flowchart",
        prompt_text: "Act as a Cloud Solutions Architect. Create a detailed architectural breakdown for a scalable real-time chat application using WebSockets, Redis pub/sub, and PostgreSQL. Detail data flow, fault tolerance, and horizontally scalable services.",
        domain: "Software Development",
        intent: "Architecture",
        complexity: "Advanced",
        tags: "Architecture, Cloud, Distributed Systems"
      },
      {
        id: "sw-7",
        title: "Git Merge Conflict Resolution & Safety",
        prompt_text: "Act as a Version Control Expert. Explain step-by-step how to safely resolve complex git merge conflicts involving rebase, cherry-pick, and stash across multiple feature branches without losing commit history.",
        domain: "Software Development",
        intent: "Troubleshooting",
        complexity: "Beginner",
        tags: "Git, DevOps, Workflow"
      },
      {
        id: "sw-8",
        title: "OAuth 2.0 Security Audit & JWT Strategy",
        prompt_text: "Act as a Cybersecurity Expert. Perform a security review of an OAuth 2.0 + JWT authentication architecture. Highlight vulnerability risks (XSS, CSRF, Token Leakage) and provide mitigation guidelines.",
        domain: "Software Development",
        intent: "Security Audit",
        complexity: "Advanced",
        tags: "Security, OAuth, JWT"
      }
    ]
  },
  {
    id: "dataset-marketing-business",
    name: "Marketing & Business Strategy Prompts.csv",
    uploadDate: "2026-09-28",
    rowCount: 20,
    columnCount: 6,
    detectedPromptCol: "prompt_text",
    domain: "Marketing",
    stats: {
      totalPrompts: 20,
      uniquePrompts: 20,
      domainsCount: 2,
      missingValues: 0,
      duplicateRecords: 0,
      avgPromptLength: 260
    },
    data: [
      {
        id: "mk-1",
        title: "SaaS Product Launch Go-To-Market Plan",
        prompt_text: "Act as a Chief Marketing Officer (CMO). Formulate a comprehensive 90-day Go-To-Market (GTM) strategy for a new B2B AI SaaS product. Include target customer personas, key messaging positioning, channel mix, pricing strategy, and launch timeline metrics.",
        domain: "Marketing",
        intent: "Strategic Planning",
        complexity: "Advanced",
        tags: "Marketing, SaaS, Strategy"
      },
      {
        id: "mk-2",
        title: "High-Converting Email Sequence Blueprint",
        prompt_text: "Act as a Direct Response Copywriter. Draft a 5-part automated email welcome sequence for new subscribers of an AI productivity platform. Focus on building trust, showcasing product value proposition, addressing objections, and compelling CTA.",
        domain: "Marketing",
        intent: "Copywriting",
        complexity: "Intermediate",
        tags: "Email, Copywriting, Sales"
      },
      {
        id: "mk-3",
        title: "SEO Keyword Strategy & Content Cluster Plan",
        prompt_text: "Act as an Enterprise SEO Director. Conduct a semantic keyword research plan for an AI Prompt Engineering domain. Structure topic clusters, pillar page recommendations, search intent mapping (Informational vs Commercial), and target meta titles.",
        domain: "Marketing",
        intent: "SEO Strategy",
        complexity: "Intermediate",
        tags: "SEO, Content, Traffic"
      },
      {
        id: "mk-4",
        title: "Competitor Intelligence Matrix & Analysis",
        prompt_text: "Act as a Business Intelligence Lead. Create a competitive analysis framework comparing top 3 AI Prompt Generators. Analyze core value propositions, feature matrix, pricing tiers, market share, strengths, and strategic differentiation opportunities.",
        domain: "Business",
        intent: "Market Research",
        complexity: "Advanced",
        tags: "Business, Strategy, Analytics"
      },
      {
        id: "mk-5",
        title: "LinkedIn Thought Leadership Content Campaign",
        prompt_text: "Act as a Viral Social Media Strategist. Write 3 engaging LinkedIn post concepts targeting Tech Executives regarding AI adoption in enterprise software. Use hook-line-sinker structure, bullet points, actionable insights, and community call-to-action.",
        domain: "Content Creation",
        intent: "Social Media",
        complexity: "Beginner",
        tags: "LinkedIn, Content, Viral"
      }
    ]
  },
  {
    id: "dataset-datascience-ai",
    name: "Data Science & ML Research Prompts.csv",
    uploadDate: "2026-09-28",
    rowCount: 18,
    columnCount: 6,
    detectedPromptCol: "prompt_text",
    domain: "Data Science",
    stats: {
      totalPrompts: 18,
      uniquePrompts: 18,
      domainsCount: 2,
      missingValues: 0,
      duplicateRecords: 0,
      avgPromptLength: 310
    },
    data: [
      {
        id: "ds-1",
        title: "Automated Exploratory Data Analysis (EDA)",
        prompt_text: "Act as a Principal Data Scientist. Write a Python script using Pandas, Seaborn, and Scikit-Learn to perform automated Exploratory Data Analysis (EDA) on a tabular dataset. Generate statistical summaries, correlation heatmaps, distribution plots, missing value imputations, and outlier detection.",
        domain: "Data Science",
        intent: "Data Analysis",
        complexity: "Advanced",
        tags: "Python, Pandas, EDA"
      },
      {
        id: "ds-2",
        title: "NLP Fine-Tuning & Hyperparameter Pipeline",
        prompt_text: "Act as an NLP Research Engineer. Outline the step-by-step methodology to fine-tune a Hugging Face Transformer model (e.g. RoBERTa or Llama) for text classification. Include data preprocessing, loss function selection, learning rate schedules, cross-validation, and evaluation metrics.",
        domain: "Data Science",
        intent: "Machine Learning",
        complexity: "Advanced",
        tags: "NLP, PyTorch, HuggingFace"
      },
      {
        id: "ds-3",
        title: "Feature Engineering for Fraud Detection",
        prompt_text: "Act as a Machine Learning Architect. Brainstorm 15 domain-specific engineered features for a financial transaction dataset aimed at detecting credit card fraud. Categorize features by time-window aggregations, velocity ratios, user behavioral baselines, and graph interaction features.",
        domain: "Data Science",
        intent: "Feature Engineering",
        complexity: "Intermediate",
        tags: "Feature Engineering, Fraud, ML"
      },
      {
        id: "ds-4",
        title: "Research Paper Methodological Summary",
        prompt_text: "Act as a Computer Science Professor. Summarize the methodologies, key architectural innovations, experimental setup, and benchmark evaluation results of the provided Machine Learning research paper into a structured 1-page summary.",
        domain: "Research",
        intent: "Academic Summary",
        complexity: "Intermediate",
        tags: "Research, Papers, AI"
      }
    ]
  }
];

export const INITIAL_SAVED_PROMPTS = [
  {
    id: "saved-1",
    title: "Senior Full Stack Code Review & Security Audit",
    domain: "Software Development",
    content: `[ROLE]
Act as a Senior Principal Full Stack Software Architect and Cybersecurity Specialist.

[OBJECTIVE]
Perform a comprehensive code review and security vulnerability audit on the provided full-stack web application code.

[CONTEXT]
The code is part of an enterprise SaaS platform processing financial payments and user PII. High standards of memory efficiency, XSS prevention, SQL injection defense, and clean design patterns are mandatory.

[TASK]
1. Scan for architectural anti-patterns and performance bottlenecks.
2. Identify security vulnerabilities mapped to OWASP Top 10.
3. Rewrite problematic sections with production-grade TypeScript/Node.js snippets.

[CONSTRAINTS]
- Do not output generic advice; provide explicit code fixes.
- Explain rationale for each refactored block.

[EXPECTED OUTPUT]
Markdown report with 3 sections: (1) Architecture Summary, (2) Security Risk Matrix, (3) Refactored Code Snippets.`,
    qualityScore: 94,
    metrics: { clarity: 95, context: 92, structure: 98, specificity: 91 },
    date: "2026-09-27",
    isFavorite: true,
    tags: ["Security", "Code Review", "Node.js"]
  },
  {
    id: "saved-2",
    title: "AI Product Pitch & Value Proposition Generator",
    domain: "Business",
    content: `[ROLE]
Act as an Expert Venture Capital Partner and Startup Pitch Coach.

[OBJECTIVE]
Craft a compelling 2-minute elevator pitch and value proposition matrix for a new AI startup.

[CONTEXT]
Targeting Series-A investors looking for scalable B2B enterprise AI automation tools.

[TASK]
Define Problem Statement, Solution, Market Size (TAM/SAM/SOM), Moat, and Financial Trajectory.

[EXPECTED OUTPUT]
Bullet points with high impact figures and persuasive narrative structure.`,
    qualityScore: 88,
    metrics: { clarity: 90, context: 85, structure: 92, specificity: 85 },
    date: "2026-09-26",
    isFavorite: false,
    tags: ["Pitch", "Startup", "Business"]
  }
];
