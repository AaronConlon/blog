import Image from "next/image";
import RoughNotationText from "./RoughNotationText";

export default function DoingLately() {
  return (
    <div className="mx-auto max-w-[760px] py-20" id="doing-lately">
      <div className="py-6 font-semibold text-2xl flex justify-center">
        <RoughNotationText>最近在做什么？</RoughNotationText>
      </div>
      <div className="grid grid-cols-1 sm:grid-rows-1 sm:grid-cols-[330px_auto] gap-4 md:gap-8 px-4">
        <Image
          src={"/coder2.svg"}
          alt="开发者插图"
          height={460}
          width={320}
          className="mx-auto min-w-[80%] sm:min-w-[320px]"
        />
        <div className="px-8 sm:px-0">
          <p className="leading-6">工作之余，我也会凭兴趣做一些项目，比如：</p>
          <ul className="list-disc list-inside py-4">
            <li className="text-primary hover:underline dark:text-primary">
              <a href="https://sisyhus.i5lin.top/" target="_blank">
                Sisyphus 西西弗标签页
              </a>
            </li>
          </ul>
          <p className="leading-6">我也在持续学习一些新的技术和工程方法：</p>
          <ul className="list-disc list-inside py-4">
            <li className="text-primary">
              TanStack 生态：Query、Router、Form 等
            </li>
            <li className="text-primary">前端 Monorepo 工程化</li>
            <li className="text-primary">Go 微服务开发</li>
            <li className="text-primary">AI Agent 开发</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
