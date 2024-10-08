import { resolveIssueBody } from "@/features/format";
import { TIssue } from "@/features/types";
import { format } from "date-fns";
import { CalendarRangeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EditEntry from "./Editor/EditorEntry";

export default function BlogItem({
  issue: { id, title, labels, updated_at, body, number },
}: {
  issue: TIssue;
}) {
  const { data } = resolveIssueBody(body);
  return (
    <div
      key={id}
      className="bg-white border border-dashed border-primary rounded-md hover:shadow-xl origin-center transition-all shadow-primary p-4 flex flex-col group relative"
    >
      <div className="group-hover:translate-x-2 group-hover:translate-y-2 absolute inset-0 w-full h-full border border-dashed border-primary z-[-1] rounded-md transition-transform"></div>
      <div className="relative mb-4 overflow-hidden">
        <Image
          src={data?.cover ?? "/coder2.svg"}
          alt="avatar"
          height={460}
          width={320}
          className="group-hover:scale-105 aspect-video transition-transform w-full max-w-[320px] mx-auto"
        />
      </div>
      <Link
        href={`/blog/post/${id}`}
        className="line-clamp-2 text-primary text-center group"
      >
        {title}
        <EditEntry issueNumber={number} />
      </Link>

      <div className="flex items-center justify-center gap-2 mt-auto pt-2 font-thin text-sm">
        <div className="flex items-center gap-1">
          <CalendarRangeIcon size={13} className="opacity-60" />
          <span className="col-span-2 font-thin opacity-80">
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
  );
}
