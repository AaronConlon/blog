"use server";

import CloseSourceProjects from "./CloseSourceProjects";
import OpenSourceProjects from "./OpenSourceProjects";

export default async function FeatureProjects() {
  return (
    <div className="overflow-hidden relative pb-12 pt-24">
      <div className="flex flex-col gap-4 items-center mx-auto max-w-[1440px]">
        <h3 className="py-6 font-semibold text-2xl">
          <span className="section-heading" id="projects">
            Featured Projects
          </span>
        </h3>
        <p className="w-72 md:w-96 max-w-[90%] text-center">
          I have worked on a number of projects, but here are a few that I am
          particularly proud of:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 px-6 gap-4">
          <OpenSourceProjects />
          <CloseSourceProjects />
        </div>
      </div>
    </div>
  );
}
