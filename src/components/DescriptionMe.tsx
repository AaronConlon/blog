import { CONFIG } from "@/config";
import Image from "next/image";

export default function DescriptionMe() {
  return (
    <div className="relative overflow-hidden">
      <span
        aria-hidden="true"
        className="absolute -top-36 rotate-12 text-gray-100 dark:text-[#1f2e3a] text-9xl scale-150 tracking-wide font-bold select-none pointer-events-none text-center"
        style={{
          transform:
            "translate3d(0px, 292.987px, 0px) rotate(12.0001deg) scale(1.5, 1.5)",
          zIndex: -1,
        }}
      >
        PASSIONATE PROGRAMMER FREELANCER FULL-STACK DEVELOPER
      </span>
      <div className="flex flex-wrap justify-center max-w-[960px] flex-row-reverse sm:flex-row mx-auto">
        <div className="w-[80%] sm:w-[60%] py-12">
          <p className="text-primary lg:text-lg font-medium dark:text-primary">
            {`Hi, I'm`}
          </p>
          <p className="text-4xl md:text-5xl xl:text-7xl 2xl:text-8xl py-1 font-semibold">
            Aaron Conlon
          </p>
          <p className="text-2xl md:text-3xl lg:text-5xl block md:my-3 text-primary dark:text-primary font-medium">
            A Full-stack Developer
          </p>
          <div className="mt-2 my-4 md:mb-8">
            <p className="mb-1">{CONFIG.author.description}</p>
            <p>
              With my expertise in React and NextJS on the frontend, and NestJS,
              MySQL and Redis on the backend, I bring a unique combination of
              technical skills and creative problem-solving to every project I
              work on.
            </p>
            <p>I really hope to get a remote job!</p>
          </div>
        </div>
        <Image
          src={"/coder.svg"}
          alt="coder avatar"
          width={460}
          height={320}
          className="w-[90vw] mx-auto sm:w-[300px] md:w-[360px]"
        />
      </div>
    </div>
  );
}
