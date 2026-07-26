import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getProjectBySlug,
  getPublishedProjectSlugs,
} from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      publishedTime: project.date,
      images: [{ url: project.cover }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="project-shell">
      <article className="project-detail">
        <Link className="project-back" href="/#projects">
          ← All projects
        </Link>

        <header className="project-header">
          <time dateTime={project.date}>{project.date}</time>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          {project.tags.length > 0 && (
            <ul className="writing-tags" aria-label="Technologies">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </header>

        <Image
          className="project-hero"
          src={project.cover}
          alt={project.coverAlt}
          width={project.coverWidth}
          height={project.coverHeight}
          sizes="(max-width: 640px) 100vw, 1100px"
          priority
        />

        <div className="writing-body project-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
