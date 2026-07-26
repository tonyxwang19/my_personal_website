import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export type ProjectSummary = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  cover: string;
  coverAlt: string;
  coverWidth: number;
  coverHeight: number;
  tags: string[];
};

export type Project = ProjectSummary & {
  content: string;
};

type Frontmatter = {
  title?: unknown;
  date?: unknown;
  summary?: unknown;
  cover?: unknown;
  coverAlt?: unknown;
  coverWidth?: unknown;
  coverHeight?: unknown;
  tags?: unknown;
  published?: unknown;
};

function getProjectFiles() {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(projectsDirectory)
    .filter((fileName) => fileName.endsWith(".md"));
}

function normalizeDate(value: unknown, fileName: string) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  throw new Error(`${fileName}: "date" must use YYYY-MM-DD.`);
}

function readProject(fileName: string): Project & { published: boolean } {
  const fullPath = path.join(projectsDirectory, fileName);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as Frontmatter;

  if (typeof frontmatter.title !== "string" || !frontmatter.title.trim()) {
    throw new Error(`${fileName}: a non-empty "title" is required.`);
  }

  if (typeof frontmatter.summary !== "string" || !frontmatter.summary.trim()) {
    throw new Error(`${fileName}: a non-empty "summary" is required.`);
  }

  if (
    typeof frontmatter.cover !== "string" ||
    !frontmatter.cover.startsWith("/") ||
    typeof frontmatter.coverAlt !== "string" ||
    !frontmatter.coverAlt.trim() ||
    typeof frontmatter.coverWidth !== "number" ||
    frontmatter.coverWidth <= 0 ||
    typeof frontmatter.coverHeight !== "number" ||
    frontmatter.coverHeight <= 0
  ) {
    throw new Error(
      `${fileName}: cover, coverAlt, coverWidth, and coverHeight are required.`,
    );
  }

  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  return {
    slug: fileName.replace(/\.md$/, ""),
    title: frontmatter.title,
    date: normalizeDate(frontmatter.date, fileName),
    summary: frontmatter.summary,
    cover: frontmatter.cover,
    coverAlt: frontmatter.coverAlt,
    coverWidth: frontmatter.coverWidth,
    coverHeight: frontmatter.coverHeight,
    tags,
    published: frontmatter.published === true,
    content,
  };
}

export function getAllProjects(): ProjectSummary[] {
  return getProjectFiles()
    .map(readProject)
    .filter((project) => project.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ content: _content, published: _published, ...summary }) => summary);
}

export function getProjectBySlug(slug: string): Project | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const fileName = `${slug}.md`;
  if (!getProjectFiles().includes(fileName)) {
    return null;
  }

  const { published, ...project } = readProject(fileName);
  return published ? project : null;
}

export function getPublishedProjectSlugs() {
  return getAllProjects().map((project) => project.slug);
}
