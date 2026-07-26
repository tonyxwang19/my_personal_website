import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const writingsDirectory = path.join(process.cwd(), "content", "writings");

export type WritingSummary = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

export type Writing = WritingSummary & {
  content: string;
};

type Frontmatter = {
  title?: unknown;
  date?: unknown;
  summary?: unknown;
  tags?: unknown;
  published?: unknown;
};

function getMarkdownFiles() {
  if (!fs.existsSync(writingsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(writingsDirectory)
    .filter((fileName) => fileName.endsWith(".md"));
}

function normalizeDate(value: unknown, fileName: string) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  throw new Error(
    `${fileName}: "date" must use the YYYY-MM-DD format.`,
  );
}

function readWriting(fileName: string): (Writing & { published: boolean }) {
  const fullPath = path.join(writingsDirectory, fileName);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as Frontmatter;

  if (typeof frontmatter.title !== "string" || !frontmatter.title.trim()) {
    throw new Error(`${fileName}: a non-empty "title" is required.`);
  }

  if (typeof frontmatter.summary !== "string") {
    throw new Error(`${fileName}: a "summary" is required.`);
  }

  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  return {
    slug: fileName.replace(/\.md$/, ""),
    title: frontmatter.title,
    date: normalizeDate(frontmatter.date, fileName),
    summary: frontmatter.summary,
    tags,
    published: frontmatter.published === true,
    content,
  };
}

export function getAllWritings(): WritingSummary[] {
  return getMarkdownFiles()
    .map(readWriting)
    .filter((writing) => writing.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ published: _published, content: _content, ...summary }) => summary);
}

export function getWritingBySlug(slug: string): Writing | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const fileName = `${slug}.md`;
  if (!getMarkdownFiles().includes(fileName)) {
    return null;
  }

  const { published, ...writing } = readWriting(fileName);
  return published ? writing : null;
}

export function getPublishedWritingSlugs() {
  return getAllWritings().map((writing) => writing.slug);
}
