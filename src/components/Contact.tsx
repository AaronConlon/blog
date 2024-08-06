import { CONFIG } from "@/config";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function Contact() {
  return (
    <div className="py-32">
      <div className="my-8 flex justify-center">
        <span
          className="section-heading inline-block font-semibold text-2xl"
          id="contact"
        >
          Contact
        </span>
      </div>
      <div className="mx-auto max-w-[1200px] p-4 flex flex-col gap-4">
        <div className="text-center font-semibold text-xl">
          Pay me something, I will do anything for you.
        </div>
        <div className="text-center max-w-[760px] mx-auto">
          As a developer, I am always looking for new projects to work on. If
          you have a project that you would like to discuss, or if you just want
          to say hi, feel free to reach out to me using the form below.
        </div>
        <div className="cursor-pointer mx-auto">
          <Link
            href={`mailto:${CONFIG.author.email}`}
            className="bg-primary/80 hover:bg-primary transition-all px-2 py-1 rounded-md text-white mt-4 flex justify-center gap-2"
          >
            <Mail />
            Send me an email
          </Link>
        </div>
      </div>
    </div>
  );
}
