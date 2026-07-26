import fs from "node:fs";
import path from "node:path";

const galleryDirectory = path.join(process.cwd(), "content", "gallery");

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type GalleryGroupSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover: GalleryPhoto;
  photoCount: number;
};

export type GalleryGroup = GalleryGroupSummary & {
  photos: GalleryPhoto[];
};

type GalleryFile = {
  title?: unknown;
  date?: unknown;
  description?: unknown;
  published?: unknown;
  photos?: unknown;
};

function getGalleryFiles() {
  if (!fs.existsSync(galleryDirectory)) {
    return [];
  }

  return fs
    .readdirSync(galleryDirectory)
    .filter((fileName) => fileName.endsWith(".json"));
}

function validatePhoto(
  photo: unknown,
  fileName: string,
  index: number,
): GalleryPhoto {
  if (!photo || typeof photo !== "object") {
    throw new Error(`${fileName}: photo ${index + 1} must be an object.`);
  }

  const value = photo as Record<string, unknown>;
  if (
    typeof value.src !== "string" ||
    !value.src.startsWith("/") ||
    typeof value.alt !== "string" ||
    !value.alt.trim() ||
    typeof value.width !== "number" ||
    value.width <= 0 ||
    typeof value.height !== "number" ||
    value.height <= 0
  ) {
    throw new Error(
      `${fileName}: photo ${index + 1} requires src, alt, width, and height.`,
    );
  }

  return {
    src: value.src,
    alt: value.alt,
    width: value.width,
    height: value.height,
    ...(typeof value.caption === "string" && value.caption.trim()
      ? { caption: value.caption }
      : {}),
  };
}

function readGalleryGroup(
  fileName: string,
): GalleryGroup & { published: boolean } {
  const fullPath = path.join(galleryDirectory, fileName);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf8")) as GalleryFile;

  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`${fileName}: a non-empty "title" is required.`);
  }

  if (typeof data.description !== "string" || !data.description.trim()) {
    throw new Error(`${fileName}: a non-empty "description" is required.`);
  }

  if (
    typeof data.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date)
  ) {
    throw new Error(`${fileName}: "date" must use YYYY-MM-DD.`);
  }

  if (!Array.isArray(data.photos) || data.photos.length === 0) {
    throw new Error(`${fileName}: at least one photo is required.`);
  }

  const photos = data.photos.map((photo, index) =>
    validatePhoto(photo, fileName, index),
  );

  return {
    slug: fileName.replace(/\.json$/, ""),
    title: data.title,
    date: data.date,
    description: data.description,
    cover: photos[0],
    photoCount: photos.length,
    photos,
    published: data.published === true,
  };
}

export function getAllGalleryGroups(): GalleryGroupSummary[] {
  return getGalleryFiles()
    .map(readGalleryGroup)
    .filter((group) => group.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ photos: _photos, published: _published, ...summary }) => summary);
}

export function getGalleryGroupBySlug(slug: string): GalleryGroup | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const fileName = `${slug}.json`;
  if (!getGalleryFiles().includes(fileName)) {
    return null;
  }

  const { published, ...group } = readGalleryGroup(fileName);
  return published ? group : null;
}

export function getPublishedGallerySlugs() {
  return getAllGalleryGroups().map((group) => group.slug);
}
