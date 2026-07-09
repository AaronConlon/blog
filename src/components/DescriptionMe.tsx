import { CONFIG } from "@/config";
import Image from "next/image";

export default function DescriptionMe() {
  return (
    <div className="relative overflow-hidden">
      <span
        aria-hidden="true"
        className="hero-background-text absolute -top-26 text-gray-100 dark:text-[#1f2e3a] text-9xl tracking-wide font-bold select-none pointer-events-none text-center"
        style={{
          zIndex: -1,
        }}
      >
        PASSIONATE PROGRAMMER FREELANCER FULL-STACK DEVELOPER
      </span>
      <div className="flex flex-wrap justify-center max-w-[960px] flex-row-reverse sm:flex-row mx-auto">
        <div className="w-[80%] sm:w-[60%] py-12">
          <p className="text-primary lg:text-lg font-medium dark:text-primary">
            你好，我是
          </p>
          <p className="text-4xl md:text-5xl xl:text-7xl 2xl:text-8xl py-1 font-semibold">
            Aaron Conlon
          </p>
          <p className="text-2xl md:text-3xl lg:text-5xl block md:my-3 text-primary dark:text-primary font-medium">
            一名全栈开发者
          </p>
          <div className="mt-2 my-4 md:mb-8">
            <p className="mb-1 leading-8">{CONFIG.author.description}</p>
            <p className="leading-8">
              我主要使用 React 和 Next.js 构建前端体验，也会用 NestJS、 MySQL 和
              Redis 处理服务端需求。对我来说，好的工程不只是代码能跑，
              还要在体验、维护成本和长期演进之间取得平衡。
            </p>
            <p>目前也期待合适的远程工作机会。</p>
          </div>
        </div>
        <Image
          src={"/coder.svg"}
          alt="开发者头像"
          width={460}
          height={320}
          className="w-[90vw] mx-auto sm:w-[300px] md:w-[360px]"
        />
      </div>
    </div>
  );
}
