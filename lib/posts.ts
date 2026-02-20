import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
  category: string;
  tags: string[];
  coverImage?: string;
};

export type Post = PostMeta & {
  content: string;
};

const postsDirectory = path.join(process.cwd(), "content/posts");

function normalizeSlug(value: string) {
  return value.normalize("NFC");
}

function resolvePostFilePathBySlug(slug: string) {
  const normalizedSlug = normalizeSlug(slug);
  const fileNames = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
  const matchedFileName = fileNames.find(
    (fileName) => normalizeSlug(fileName.replace(/\.md$/, "")) === normalizedSlug
  );

  if (!matchedFileName) {
    return null;
  }

  return path.join(postsDirectory, matchedFileName);
}

function normalizeCategory(category?: string) {
  const value = (category || "").trim();
  return value.length > 0 ? value : "General";
}

function normalizePublished(published?: boolean) {
  return published !== false;
}

export function toCategorySlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function getAllPostsMeta(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));

  return fileNames
    .map((fileName) => {
      const slug = normalizeSlug(fileName.replace(/\.md$/, ""));
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        published: normalizePublished(data.published as boolean | undefined),
        category: normalizeCategory(data.category as string | undefined),
        coverImage: data.coverImage as string | undefined,
        tags: (data.tags as string[]) || []
      };
    })
    .filter((post) => post.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllSlugs() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }));
}

export function getCategoryStats() {
  const stats = new Map<string, number>();

  for (const post of getAllPostsMeta()) {
    stats.set(post.category, (stats.get(post.category) || 0) + 1);
  }

  return Array.from(stats.entries())
    .map(([name, count]) => ({
      name,
      slug: toCategorySlug(name),
      count
    }))
    .sort((a, b) => (a.count === b.count ? a.name.localeCompare(b.name) : b.count - a.count));
}

export function getPostsByCategorySlug(categorySlug: string) {
  return getAllPostsMeta().filter((post) => toCategorySlug(post.category) === categorySlug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = resolvePostFilePathBySlug(slug);
  if (!fullPath) {
    return null;
  }
  const normalizedSlug = normalizeSlug(slug);

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const isPublished = normalizePublished(data.published as boolean | undefined);
  if (!isPublished) {
    return null;
  }
  const processedContent = await remark().use(html).process(content);

  return {
    slug: normalizedSlug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    published: isPublished,
    category: normalizeCategory(data.category as string | undefined),
    tags: (data.tags as string[]) || [],
    coverImage: data.coverImage as string | undefined,
    content: processedContent.toString()
  };
}
