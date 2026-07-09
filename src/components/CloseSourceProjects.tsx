import { CONFIG } from "@/config";
import Image from "next/image";
import Link from "next/link";

export default function CloseSourceProjects() {
  return (
    <>
      <div className="sm:col-span-2 md:col-span-4 font-semibold text-2xl uppercase mt-12">
        个人项目
      </div>
      {CONFIG.projects.map((project) => (
        <div
          key={project.name}
          className="bg-white shadow-lg border border-primary/10 rounded-t-lg overflow-hidden flex flex-col"
        >
          <div className="overflow-hidden">
            <Image
              src={project.cover}
              alt="项目封面"
              className="w-full aspect-video"
              width={315}
              height={161}
            />
          </div>
          <Link
            href={project.homepage == "" ? "/" : project.homepage}
            target="_blank"
            className="text-primary mr-auto p-2 w-full min-h-16 flex flex-col justify-center"
          >
            <span className="font-semibold text-lg leading-8 truncate mb-2">
              {project.name.trim()}
            </span>
            {project.description?.length ? (
              <span className="text-sm leading-4 line-clamp-3 text-primary/80">
                {project.description}
              </span>
            ) : null}
          </Link>

          <div className="flex items-center flex-wrap gap-4 p-2 topics mt-auto">
            {project.topics.map((topic) => (
              <span
                key={topic}
                className="bg-primary/5 text-primary p-0.5 rounded-full px-2"
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
