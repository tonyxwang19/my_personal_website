import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGalleryGroupBySlug,
  getPublishedGallerySlugs,
} from "@/lib/gallery";

type GalleryGroupPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedGallerySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GalleryGroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = getGalleryGroupBySlug(slug);

  if (!group) {
    return {};
  }

  return {
    title: group.title,
    description: group.description,
    openGraph: {
      title: group.title,
      description: group.description,
      type: "website",
      images: [{ url: group.cover.src }],
    },
  };
}

export default async function GalleryGroupPage({
  params,
}: GalleryGroupPageProps) {
  const { slug } = await params;
  const group = getGalleryGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  return (
    <main className="gallery-shell">
      <article className="gallery-detail">
        <Link className="gallery-back" href="/#gallery">
          ← All photo sets
        </Link>

        <header className="gallery-header">
          <time dateTime={group.date}>{group.date}</time>
          <h1>{group.title}</h1>
          <p>{group.description}</p>
          <span>{group.photoCount} photos</span>
        </header>

        <div className="photo-set">
          {group.photos.map((photo, index) => (
            <figure key={`${photo.src}-${index}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 100vw, 1100px"
              />
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </article>
    </main>
  );
}
