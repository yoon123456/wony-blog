import fs from "node:fs";
import path from "node:path";

function loadLocalEnv() {
  const envFiles = [".env.local", ".env"];

  for (const fileName of envFiles) {
    const fullPath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const raw = fs.readFileSync(fullPath, "utf8");
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex <= 0) {
        continue;
      }

      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

function parseArgs(argv) {
  const args = {};

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
    args[key] = value;

    if (value !== "true") {
      i += 1;
    }
  }

  return args;
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\u3131-\u318E\uAC00-\uD7A3]/g, (ch) => ch)
    .replace(/[^a-z0-9\u3131-\u318E\uAC00-\uD7A3\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractJsonBlock(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response");
  }

  return JSON.parse(text.slice(start, end + 1));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function quoteYamlString(value) {
  return String(value || "").replace(/"/g, "'");
}

function extractTextFromGeminiResponse(response) {
  const candidate = response?.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const textParts = parts.map((part) => part.text).filter(Boolean);
  return textParts.join("\n").trim();
}

function extractGroundedSources(response) {
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return chunks
    .map((chunk) => chunk.web)
    .filter(Boolean)
    .map((web) => ({
      title: web.title || "Untitled",
      url: web.uri || "",
      published_at: "",
      reason: "Google Search grounding source"
    }))
    .filter((source) => source.url)
    .slice(0, 8);
}

async function callGemini({ apiKey, model, prompt, responseMimeType = "text/plain", tools }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      responseMimeType
    }
  };

  if (tools?.length) {
    body.tools = tools;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

async function main() {
  loadLocalEnv();

  const args = parseArgs(process.argv);
  const topic = args.topic;
  const category = args.category || "일반";
  const tagsArg = args.tags || "";
  const tags = tagsArg
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!topic) {
    console.error('Usage: npm run generate:post -- --topic "주제" --category "카테고리" --tags "태그1,태그2"');
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is required in your environment.");
    process.exit(1);
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  console.log("[1/3] Researching web sources...");

  const researchPrompt = [
    "You are a careful research assistant.",
    `Research this topic for a Korean blog post: "${topic}".`,
    "Return valid JSON only (no markdown fences) with this shape:",
    "{",
    '  "title": string,',
    '  "description": string,',
    '  "key_points": string[],',
    '  "sources": [{"title": string, "url": string, "published_at": string, "reason": string}]',
    "}",
    "Rules:",
    "- At least 4 sources, max 8",
    "- Prefer reliable primary or authoritative sources",
    "- description <= 120 chars",
    "- key_points should be practical"
  ].join("\n");

  let researchResponse;
  try {
    researchResponse = await callGemini({
      apiKey,
      model,
      prompt: researchPrompt,
      responseMimeType: "application/json",
      tools: [{ google_search: {} }]
    });
  } catch {
    researchResponse = await callGemini({
      apiKey,
      model,
      prompt: researchPrompt,
      responseMimeType: "application/json"
    });
  }

  const researchText = extractTextFromGeminiResponse(researchResponse);
  const research = extractJsonBlock(researchText || "{}");

  const groundedSources = extractGroundedSources(researchResponse);
  if (!Array.isArray(research.sources) || research.sources.length === 0) {
    research.sources = groundedSources;
  }

  console.log("[2/3] Drafting markdown content...");

  const draftPrompt = [
    "You are a senior Korean blog writer.",
    "Write practical, readable, SEO-friendly markdown.",
    `Topic: ${topic}`,
    "Target audience: parents and practical learners",
    `Key points: ${JSON.stringify(research.key_points || [])}`,
    "Requirements:",
    "- Use one H1 title",
    "- 5~7 meaningful H2/H3 sections",
    "- Include actionable checklist(s)",
    "- Avoid made-up stats",
    "- End with short summary",
    "- End with section title \"## 참고 자료\" and list all sources as numbered markdown links from this JSON:",
    JSON.stringify(research.sources || [], null, 2),
    "Return markdown only."
  ].join("\n");

  const draftResponse = await callGemini({
    apiKey,
    model,
    prompt: draftPrompt,
    responseMimeType: "text/plain"
  });

  const markdownBody = extractTextFromGeminiResponse(draftResponse);
  if (!markdownBody) {
    throw new Error("Model returned empty markdown.");
  }

  console.log("[3/3] Saving to content/posts...");
  const slug = args.slug || slugify(topic);
  const filePath = path.join(process.cwd(), "content/posts", `${slug}.md`);

  const frontmatter = [
    "---",
    `title: "${quoteYamlString(research.title || topic)}"`,
    `description: "${quoteYamlString(research.description || `${topic} 실전 가이드`)}"`,
    `date: "${todayIso()}"`,
    "published: true",
    `category: "${quoteYamlString(category)}"`,
    `tags: [${(tags.length ? tags : [category, "가이드", "실전"])
      .map((t) => `"${quoteYamlString(t)}"`)
      .join(", ")}]`,
    "---",
    ""
  ].join("\n");

  fs.writeFileSync(filePath, `${frontmatter}${markdownBody}\n`, "utf8");
  console.log(`Created: ${path.relative(process.cwd(), filePath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
