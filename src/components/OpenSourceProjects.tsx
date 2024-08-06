import { CONFIG } from "@/config";
import { getCacheRepos } from "@/features/cache";
import { ArrowRightCircle, Github, Home, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function OpenSourceProjects() {
  const repos = await getCacheRepos();
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
      <div className="flex justify-center items-center relative flex-col gap-4 bg-gradient-to-tr from-teal-300 to-primary px-8 rounded-md shadow-primary/80 hover:shadow-primary shadow-lg transition-shadow p-12 sm:p-0">
        <div className="flex items-center gap-3 px-2">
          <Github color="cyan" size={32} />
          <div>
            <span className="text-white">{repos.length}</span> repositories
            found in my github profile
          </div>
        </div>
        <Link
          className="font-semibold text-2xl px-2 xl:px-8"
          href={CONFIG.author.githubProfile}
          target="_blank"
        >
          Other projects can be explored in my github profile
        </Link>
        <Link href={CONFIG.author.githubProfile} target="_blank">
          <ArrowRightCircle className="absolute bottom-6 right-8" />
        </Link>
      </div>
    </>
  );
}
