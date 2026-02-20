import fs from "node:fs";
import path from "node:path";

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
    .replace(/[^a-z0-9\u3131-\u318E\uAC00-\uD7A3\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function quoteYamlString(value) {
  return String(value || "").replace(/"/g, "'");
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function usage() {
  console.log(
    'Usage: npm run new:post -- --title "제목" --category "카테고리" --tags "태그1,태그2" [--coverImage "/posts/example.svg"] [--slug "custom-slug"] [--force]'
  );
}

function main() {
  const args = parseArgs(process.argv);
  const title = args.title;

  if (!title) {
    usage();
    process.exit(1);
  }

  const category = args.category || "일반";
  const tags = (args.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const coverImage = args.coverImage || "/posts/example-cover.jpg";
  const slug = args.slug || slugify(title);
  const force = args.force === "true";

  if (!slug) {
    console.error("Failed to create slug. Please provide --slug.");
    process.exit(1);
  }

  const postsDir = path.join(process.cwd(), "content/posts");
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  if (fs.existsSync(filePath) && !force) {
    console.error(`File already exists: ${path.relative(process.cwd(), filePath)}`);
    console.error("Use --force to overwrite or --slug to create another file.");
    process.exit(1);
  }

  const frontmatter = [
    "---",
    `title: "${quoteYamlString(title)}"`,
    `description: "${quoteYamlString(`${title}에 대한 실전 가이드`)}"`,
    `date: "${todayIso()}"`,
    "published: true",
    `category: "${quoteYamlString(category)}"`,
    `coverImage: "${quoteYamlString(coverImage)}"`,
    `tags: [${(tags.length ? tags : [category, "실전", "가이드"]).map((tag) => `"${quoteYamlString(tag)}"`).join(", ")}]`,
    "---",
    "",
    "# 본문",
    "",
    "여기에 ChatGPT에서 생성한 마크다운 본문을 붙여넣으세요.",
    ""
  ].join("\n");

  fs.writeFileSync(filePath, frontmatter, "utf8");
  console.log(`Created template: ${path.relative(process.cwd(), filePath)}`);
}

main();
