import { CONFIG } from "@/config";
import Image from "next/image";
import Link from "next/link";

export default function CloseSourceProjects() {
  return (
    <>
      <div className="sm:col-span-2 md:col-span-4 font-semibold text-2xl uppercase mt-12">
        Solo projects
      </div>
      {CONFIG.projects.map((project) => (
        <div
          key={project.name}
          className="bg-white shadow-lg border border-transparent hover:border-primary/50 rounded-t-lg overflow-hidden __project__ group flex flex-col"
        >
          <div className="overflow-hidden">
            <Image
              src={project.cover}
              alt="repo cover"
              className="w-full group-hover:scale-110 transition-transform duration-300 aspect-video"
              width={315}
              height={161}
            />
          </div>
          <Link
            href={project.homepage}
            target="_blank"
            className="font-semibold text-lg text-primary mr-auto p-2 w-full block line-clamp-2 min-h-12"
          >
            {project.name.trim()}
            {project.description?.length ? ":" : ""}
            <span className="pl-2">{project.description}</span>
          </Link>

          <div className="flex items-center flex-wrap gap-4 p-2 topics mt-auto">
            {project.topics.map((topic) => (
              <span
                key={topic}
                className="bg-primary/10 text-primary px-1 rounded-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
