import { CONFIG } from "@/config";
import { Mail } from "lucide-react";
import Link from "next/link";
import RoughNotationText from "./RoughNotationText";

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
        <div className="cursor-pointer mx-auto">
          <Link
            href={`mailto:${CONFIG.author.email}`}
            className="bg-primary/80 hover:bg-primary transition-all px-2 py-1 rounded-md text-white mt-4 flex justify-center gap-2"
          >
            <Mail />
            给我发邮件
          </Link>
        </div>
      </div>
    </div>
  );
}
