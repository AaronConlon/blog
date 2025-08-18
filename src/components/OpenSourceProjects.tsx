import { CONFIG } from "@/config";
import { getReposByRepoNames } from "@/features/api";
import { TRepo } from "@/features/types";
import { ArrowRightCircle, Github, Home, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function OpenSourceProjects() {
  const repos = await getReposByRepoNames([
    "blog",
    "erin",
    "x-profile-menu-expansion-website",
    "x-profile-menu-expansion",
    "GitBatch",
    "create-juice-app",
  ]);

  return (
    <>
      <div className="sm:col-span-2 md:col-span-4 font-semibold text-2xl uppercase">
        open source
      </div>
      {repos
        .filter((project) => project.stargazers_count > 1)
        .sort((prev, cur) => cur.stargazers_count - prev.stargazers_count)
        .map((project) => {
          return (
            <div
              key={project.id}
              className="bg-white shadow-lg border border-transparent hover:border-primary/50 rounded-t-lg overflow-hidden __project__ flex flex-col group"
            >
              <div className="overflow-hidden">
                <Image
                  src={`https://opengraph.githubassets.com/[random-string]/${CONFIG.author.name}/${project.name}`}
                  alt="repo cover"
                  className="w-full group-hover:scale-110 transition-transform duration-300"
                  width={315}
                  height={161}
                />
              </div>
              <Link
                href={project.html_url}
                target="_blank"
                className="font-semibold text-lg text-primary mr-auto p-2 w-full block line-clamp-2 min-h-12"
              >
                {project.name.trim()}
                {project.description?.length ? ":" : ""}
                <span className="pl-2">{project.description}</span>
              </Link>

              <div className="flex items-center flex-wrap gap-4 p-2 topics">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-primary/10 text-primary px-1 rounded-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="py-2 px-3 flex items-center gap-1 mt-auto more-info">
                <Star size={18} />
                <span className="font-thin">{project.stargazers_count}</span>
                <span className=" text-sm font-thin">{project.language}</span>
                {project.homepage && (
                  <Link
                    href={project.homepage}
                    target="_blank"
                    className="ml-auto"
                  >
                    <Home size={18} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
    </>
  );
}
