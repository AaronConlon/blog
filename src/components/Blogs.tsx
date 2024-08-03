import { getCacheIssues } from "@/features/cache";
import { format } from "date-fns";
import { CalendarRangeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Blogs() {
  const issues = await getCacheIssues();
  return (
    <div className="flex flex-col gap-8 py-20 bg-gray-50">
      <div className="font-semibold text-2xl flex justify-center">
        <span className="section-heading" id="blog">
          Blog
        </span>
      </div>
      <p className="max-w-[760px] text-center mx-auto">
        When I encounter some problems at work and study, I sometimes record
        them so that I can review them later. If you are interested, you can
        also{" "}
        <span
          className="section-heading"
          data-type="highlight"
          data-color="#fff176"
        >
          subscribe to my blog
        </span>
        .
      </p>
      <div className="max-w-[1440px] mx-auto p-4 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 relative">
        {issues.map(({ title, labels, id, updated_at }) => (
          <div
            key={id}
            className="bg-white rounded-md hover:shadow-xl hover:scale-105 origin-center transition-all shadow-primary p-4 flex flex-col"
          >
            <div className="relative mb-4">
              <Image
                src={"/coder2.svg"}
                alt="avatar"
                height={460}
                width={320}
              />
              <Image
                src="https://avatars.githubusercontent.com/u/23721611?s=48&v=4"
                alt="avatar"
                width={36}
                height={36}
                className="absolute bottom-4 left-4 rounded-full"
              />
            </div>
            <Link
              href={`/blog/post/${id}`}
              className="line-clamp-2 text-primary text-center"
            >
              {title}
            </Link>

            <div className="flex justify-center items-center gap-2 mt-auto pt-2 font-thin text-sm">
              <div className="flex items-center gap-1">
                <CalendarRangeIcon size={13} />
                <span className="col-span-2 font-thin opacity-40">
                  {format(new Date(updated_at), "yyyy-MM-dd")} updated.
                </span>
              </div>
            </div>
            <div className="flex gap-1 justify-end pt-2 flex-wrap h-1 opacity-0">
              {labels
                .map((i) => i.name)
                .map((name) => (
                  <Link
                    key={name}
                    href={`/blog/tag/${name}`}
                    className="text-primary font-thin text-sm px-1 py-0.5 rounded-sm border border-primary/40"
                  >
                    {name}
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
      <Link
        href={"/blog"}
        className="text-center text-primary/80 underline-offset-2 underline"
      >
        Read more post...
      </Link>
    </div>
  );
}
