import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects by Hsi-Ning Wang.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="project-shell">
      <section className="project-index">
        <Link className="project-back" href="/#projects">
          ← Home
        </Link>
        <h1>Projects</h1>

        {projects.length > 0 ? (
          <ol className="gallery-group-list">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`}>
                  <div className="gallery-cover">
                    <Image
                      src={project.cover}
                      alt={project.coverAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="gallery-card-copy">
                    <span>
                      <strong>{project.title}</strong>
                      <small>{project.summary}</small>
                    </span>
                    <span className="gallery-card-meta">
                      <time dateTime={project.date}>{project.date}</time>
                      {project.tags.length > 0 && (
                        <span>{project.tags.join(" · ")}</span>
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p>No published projects yet.</p>
        )}
      </section>
    </main>
  );
}
