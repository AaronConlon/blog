import CloseSourceProjects from "./CloseSourceProjects";
import OpenSourceProjects from "./OpenSourceProjects";
import RoughNotationText from "./RoughNotationText";

export default async function FeatureProjects() {
  return (
    <div className="overflow-hidden relative pb-12 pt-24">
      <div className="flex flex-col gap-4 items-center mx-auto max-w-[1440px]">
        <h3 className="py-6 font-semibold text-2xl">
          <RoughNotationText id="projects">精选项目</RoughNotationText>
        </h3>
        <p className="w-72 md:w-96 max-w-[90%] text-center">
          我做过一些不同类型的项目，下面是其中几个比较有代表性的作品：
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-6 md:px-20 xl:px-6 gap-4">
          <OpenSourceProjects />
          <CloseSourceProjects />
        </div>
      </div>
    </div>
  );
}
