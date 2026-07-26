import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllGalleryGroups } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo sets by Hsi-Ning Wang.",
};

export default function GalleryPage() {
  const groups = getAllGalleryGroups();

  return (
    <main className="gallery-shell">
      <section className="gallery-index">
        <Link className="gallery-back" href="/#gallery">
          ← Home
        </Link>
        <h1>Gallery</h1>

        {groups.length > 0 ? (
          <ol className="gallery-group-list">
            {groups.map((group) => (
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
    </main>
  );
}
