import { PersonalWebsite } from "./personal-website";
import { getAllGalleryGroups } from "@/lib/gallery";
import { getAllProjects } from "@/lib/projects";
import { getAllWritings } from "@/lib/writings";

export default function Home() {
  const writings = getAllWritings();
  const galleryGroups = getAllGalleryGroups();
  const projects = getAllProjects();

  return (
    <PersonalWebsite
      writings={writings}
      galleryGroups={galleryGroups}
      projects={projects}
    />
  );
}
