import { CONFIG } from "@/config";
import { Mail } from "lucide-react";
import Link from "next/link";
import RoughNotationText from "./RoughNotationText";

function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16.8198 20.7684L3.75317 3.96836C3.44664 3.57425 3.72749 3 4.22678 3H6.70655C6.8917 3 7.06649 3.08548 7.18016 3.23164L20.2468 20.0316C20.5534 20.4258 20.2725 21 19.7732 21H17.2935C17.1083 21 16.9335 20.9145 16.8198 20.7684Z"
        stroke="currentColor"
      />
      <path
        d="M20 3L4 21"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Contact() {
  return (
    <div className="py-32">
      <div className="my-8 flex justify-center">
        <RoughNotationText className="font-semibold text-2xl" id="contact">
          联系我
        </RoughNotationText>
      </div>
      <div className="mx-auto max-w-[1200px] p-4 flex flex-col gap-4">
        <div className="text-center font-semibold text-xl">
          给我一点预算，我可以帮你把想法落地。
        </div>
        <div className="text-center max-w-[760px] mx-auto">
          如果你有项目想聊，或者只是想打个招呼，都可以通过下面的方式联系我。
        </div>
        <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`mailto:${CONFIG.author.email}`}
            className="bg-primary/80 hover:bg-primary transition-all px-3 py-1.5 rounded-md text-white mt-4 flex items-center justify-center gap-2"
          >
            <Mail size={20} />
            给我发邮件
          </Link>
          <Link
            href={CONFIG.author.twitterProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/85 hover:bg-black transition-all px-3 py-1.5 rounded-md text-white mt-4 flex items-center justify-center gap-2"
          >
            <XIcon />
            打声招呼
          </Link>
        </div>
      </div>
    </div>
  );
}
