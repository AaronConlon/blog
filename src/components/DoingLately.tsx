import Image from "next/image";

export default function DoingLately() {
  return (
    <div className="mx-auto max-w-[760px] py-20" id="doing-lately">
      <div className="py-6 font-semibold text-2xl flex justify-center">
        <span className="section-heading">What am I doing lately??</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-rows-1 sm:grid-cols-[330px_auto] gap-4 md:gap-8 px-4">
        <Image
          src={"/coder2.svg"}
          alt="avatar"
          height={460}
          width={320}
          className="mx-auto min-w-[80%] sm:min-w-[320px]"
        />
        <div className="px-8 sm:px-0">
          <p className="leading-6">
            {` After company's work, I also write some projects with my passion. Such as:`}
          </p>
          <ul className="list-disc list-inside py-4">
            <li className="text-primary hover:underline dark:text-primary">
              <a href="/">NextJS Blog</a>
            </li>
            <li className="text-primary hover:underline dark:text-primary">
              <a
                href="https://batch-manage-github-repos.i5lin.top/"
                target="_blank"
              >
                Batch manage github repositories
              </a>
            </li>
            <li className="text-primary hover:underline dark:text-primary">
              <a
                href="https://chromewebstore.google.com/detail/erin-%E7%BA%AF%E5%87%80%E7%9A%84%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5/nobdiagkeelcndaijbdninbmjkdahggd?hl=zh-CN&authuser=0"
                target="_blank"
              >
                Erin
              </a>
            </li>
          </ul>
          <p className="leading-6">
            {`I am also learning some new technologies, such as:`}
          </p>
          <ul className="list-disc list-inside py-4">
            <li className="text-primary">
              TanStack teammate skills:Query,Router,Form.etc.
            </li>
            <li className="text-primary">
              Frontend project with monorepo skill stack
            </li>
            <li className="text-primary">Swift for IOS development</li>
            <li className="text-primary">Feature-Sliced Design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
