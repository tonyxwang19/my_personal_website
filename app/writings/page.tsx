import type { Metadata } from "next";
import Link from "next/link";
import { getAllWritings } from "@/lib/writings";

export const metadata: Metadata = {
  title: "Writings",
  description: "Notes and essays by Hsi-Ning Wang.",
};

export default function WritingsPage() {
  const writings = getAllWritings();

  return (
    <main className="writing-shell">
      <section className="writing-index">
        <Link className="writing-back" href="/#writings">
          ← Home
        </Link>
        <h1>Writings</h1>

        {writings.length > 0 ? (
          <ol className="writing-list">
            {writings.map((writing) => (
              <li key={writing.slug}>
                <Link href={`/writings/${writing.slug}`}>
                  <span>
                    <strong>{writing.title}</strong>
                    <small>{writing.summary}</small>
                  </span>
                  <time dateTime={writing.date}>{writing.date}</time>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p>No published writings yet.</p>
        )}
      </section>
    </main>
  );
}
