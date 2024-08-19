import { updateIssue } from "@/features/api";
import { localIssuesAtom, localTokenAtom } from "@/features/atom";
import { cn, formatTimeFromNow } from "@/features/format";
import { ILocalIssue, TIssue } from "@/features/types";
import { useAtomValue, useSetAtom } from "jotai";
import { Calendar, Edit2Icon, X } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface RecentIssuesProps {
  issues: Partial<TIssue>[] | ILocalIssue[];
  isLocal: boolean;
  onPickToEdit: (issueNumber: number) => void;
  setIssues: Dispatch<SetStateAction<Partial<TIssue>[]>>;
}
export default function RecentIssues({
  issues,
  isLocal,
  onPickToEdit,
  setIssues,
}: RecentIssuesProps) {
  const setLocalIssues = useSetAtom(localIssuesAtom);
  const token = useAtomValue(localTokenAtom);

  return (
    <div className="border h-screen overflow-auto">
      <h1 className="p-4 text-primary font-semibold text-2xl mb-2 sticky top-0 w-full bg-white z-10 flex justify-between">
        <span className="bg-primary text-white px-2 rounded-md min-w-8 text-center">
          {issues.length}
        </span>
        <span>{isLocal ? "Local Issues" : "Online issues"}</span>
      </h1>

      <ul className="flex flex-col gap-4 font-thin text-sm p-4">
        {issues.length === 0
          ? "no issue..."
          : issues.map(({ number, title, updated_at, id, ...rest }) => (
              <li
                key={number}
                className="grid grid-cols-[168px_auto_48px] gap-1 group hover:bg-primary/10 p-1"
              >
                <span className="flex items-center gap-1 text-primary">
                  <Calendar size={16} className="opacity-60" />
                  Updated: {formatTimeFromNow(updated_at!)}
                </span>
                <Link href={`/blog/post/${id}`} className="truncate">
                  {title}
                </Link>
                <div className="flex items-center justify-end">
                  <Edit2Icon
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mr-2"
                    onClick={() => onPickToEdit(number!)}
                    size={18}
                  />
                  <X
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
                      {
                        // @ts-ignore
                        hidden: !isLocal && rest.state === "closed",
                      }
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (isLocal) {
                        setLocalIssues((prev) =>
                          prev.filter((i) => i.number !== number)
                        );
                      } else {
                        updateIssue({ state: "closed" }, number!, token!)
                          .then((newIssue) => {
                            setIssues((prev) =>
                              prev.map((i) => {
                                if (i.number === number) {
                                  return newIssue;
                                }
                                return i;
                              })
                            );
                          })
                          .catch(() => {
                            toast.error("Failed to close issue");
                          });
                      }
                    }}
                    size={18}
                  />
                </div>
              </li>
            ))}
      </ul>
    </div>
  );
}
