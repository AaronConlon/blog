import { formatTimeFromNow } from "@/features/format";
import { ILocalIssue, TIssue } from "@/features/types";
import { Calendar, Edit2Icon } from "lucide-react";
import Link from "next/link";

interface RecentIssuesProps {
  issues: Partial<TIssue>[] | ILocalIssue[];
  isLocal: boolean;
  onPickToEdit: (issueNumber: number) => void;
}
export default function RecentIssues({
  issues,
  isLocal,
  onPickToEdit,
}: RecentIssuesProps) {
  return (
    <div className="border h-screen overflow-auto">
      <h1 className="p-4 text-primary font-semibold text-2xl mb-2 sticky top-0 w-full bg-white z-10">
        {isLocal ? "Local Issues" : "Online issues"}
      </h1>

      <ul className="flex flex-col gap-4 font-thin text-sm p-4">
        {issues.length === 0
          ? "no issue..."
          : issues.map(({ number, title, updated_at, id }) => (
              <li
                key={number}
                className="grid grid-cols-[144px_auto_24px] gap-1 group"
              >
                <span className="flex items-center gap-1 text-primary">
                  <Calendar size={16} className="opacity-60" />
                  Updated: {formatTimeFromNow(updated_at!)}
                </span>
                <Link href={`/blog/post/${id}`}>{title}</Link>
                <Edit2Icon
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onPickToEdit(number!);
                  }}
                />
              </li>
            ))}
      </ul>
    </div>
  );
}
