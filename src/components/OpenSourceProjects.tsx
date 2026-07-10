import { CONFIG } from "@/config";
import { getReposByRepoNames } from "@/features/api";
import { Home, Star } from "lucide-react";
import Link from "next/link";
import OpenSourceProjectCover from "./OpenSourceProjectCover";

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
        开源项目
      </div>
      {repos
        .filter((project) => project.stargazers_count > 1)
        .sort((prev, cur) => cur.stargazers_count - prev.stargazers_count)
        .map((project) => {
          return (
            <div
              key={project.id}
              className="bg-white shadow-sm border border-primary/10 rounded-t-lg overflow-hidden flex flex-col"
            >
              <div className="overflow-hidden">
                <OpenSourceProjectCover
                  src={`https://opengraph.githubassets.com/[random-string]/${CONFIG.author.name}/${project.name}`}
                  alt={`${project.name} 仓库封面`}
                />
              </div>
              <Link
                href={project.html_url}
                target="_blank"
                className="text-primary mr-auto p-2 w-full min-h-16 flex flex-col justify-center"
              >
                <span className="font-semibold text-lg leading-7 truncate mb-2">
                  {project.name.trim()}
                </span>
                {
                  <span className="text-sm leading-5 line-clamp-1 text-primary/80">
                    {project.description || "-"}
                  </span>
                }
              </Link>

              <div className="flex items-center flex-wrap gap-4 p-2 topics">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-primary/5 text-primary p-0.5 rounded-full px-2"
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
