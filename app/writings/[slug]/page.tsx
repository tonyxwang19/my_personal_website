import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getPublishedWritingSlugs,
  getWritingBySlug,
} from "@/lib/writings";

type WritingPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedWritingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);

  if (!writing) {
    return {};
  }

  return {
    title: writing.title,
    description: writing.summary,
    openGraph: {
      title: writing.title,
      description: writing.summary,
      type: "article",
      publishedTime: writing.date,
    },
  };
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);

  if (!writing) {
    notFound();
  }

  return (
    <main className="writing-shell">
      <article className="writing-article">
        <Link className="writing-back" href="/#writings">
          ← All writings
        </Link>

        <header className="writing-header">
          <time dateTime={writing.date}>{writing.date}</time>
          <h1>{writing.title}</h1>
          <p>{writing.summary}</p>
          {writing.tags.length > 0 && (
            <ul className="writing-tags" aria-label="Tags">
              {writing.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </header>

        <div className="writing-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {writing.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
