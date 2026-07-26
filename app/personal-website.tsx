"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { GalleryGroupSummary } from "@/lib/gallery";
import type { ProjectSummary } from "@/lib/projects";
import type { WritingSummary } from "@/lib/writings";

const sections = [
  "home",
  "projects",
  "writings",
  "gallery",
  "about",
] as const;
type Section = (typeof sections)[number];

function isSection(value: string): value is Section {
  return sections.includes(value as Section);
}

export function PersonalWebsite({
  writings,
  galleryGroups,
  projects,
}: {
  writings: WritingSummary[];
  galleryGroups: GalleryGroupSummary[];
  projects: ProjectSummary[];
}) {
  const [activeSection, setActiveSection] = useState<Section>("home");

  useEffect(() => {
    function syncWithHash() {
      const section = window.location.hash.slice(1);
      setActiveSection(isSection(section) ? section : "home");
    }

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, []);

  return (
    <>
      <header id="header">
        <img src="/logo.png" alt="Hsi-Ning Wang logo" />
        <h1>Hsi-Ning Wang</h1>

        <nav aria-label="Main navigation">
          <ul className="main-menu">
            {sections.map((section) => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  className={activeSection === section ? "active" : undefined}
                  aria-current={
                    activeSection === section ? "page" : undefined
                  }
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="container">
        <div className="inner">
          <div id="content" aria-live="polite">
            {activeSection === "home" && (
              <section id="home" className="content-region">
                <h2>Home</h2>
                <p>
                  Welcome. This is my personal website — a quiet place for my
                  work, notes, and the things I am exploring.
                </p>
              </section>
            )}

            {activeSection === "projects" && (
              <section id="projects" className="content-region">
                <h2>Projects</h2>
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
                              <time dateTime={project.date}>
                                {project.date}
                              </time>
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
            )}

            {activeSection === "writings" && (
              <section id="writings" className="content-region">
                <h2>Writings</h2>
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
            )}

            {activeSection === "gallery" && (
              <section id="gallery" className="content-region">
                <h2>Gallery</h2>
                {galleryGroups.length > 0 ? (
                  <ol className="gallery-group-list">
                    {galleryGroups.map((group) => (
                      <li key={group.slug}>
                        <Link href={`/gallery/${group.slug}`}>
                          <div className="gallery-cover">
                            <Image
                              src={group.cover.src}
                              alt={group.cover.alt}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                          </div>
                          <div className="gallery-card-copy">
                            <span>
                              <strong>{group.title}</strong>
                              <small>{group.description}</small>
                            </span>
                            <span className="gallery-card-meta">
                              <time dateTime={group.date}>{group.date}</time>
                              <span>{group.photoCount} photos</span>
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>No published photo sets yet.</p>
                )}
              </section>
            )}

            {activeSection === "about" && (
              <section id="about" className="content-region">
                <h2>About</h2>
                <p>
                  I&apos;m Hsi-Ning Wang. I care about clear thinking, useful
                  work, and simple digital experiences built with attention to
                  detail.
                </p>

                <div className="contact-block">
                  <h3>Contact</h3>
                  <ul className="contact-links">
                    <li>
                      <span>ig</span>
                      <a
                        href="https://www.instagram.com/hsiningwow/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        @hsiningwow
                      </a>
                    </li>
                    <li>
                      <span>linkedin</span>
                      <a
                        href="https://www.linkedin.com/in/hsiningwang/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        hsiningwang
                      </a>
                    </li>
                    <li>
                      <span>github</span>
                      <a
                        href="https://github.com/tonyxwang19"
                        target="_blank"
                        rel="noreferrer"
                      >
                        tonyxwang19
                      </a>
                    </li>
                  </ul>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <footer>© {new Date().getFullYear()} Hsi-Ning Wang</footer>
    </>
  );
}
