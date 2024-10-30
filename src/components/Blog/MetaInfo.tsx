import { isTooOldIssueCreatedAt } from "@/features/calc";
import { cn, formatTime } from "@/features/format";
import { TIssue } from "@/features/types";
import { Calendar, FileWarning } from "lucide-react";
import ClientFromNowTime from "./ClientFromNowTime";

interface MetaInfoProps {
  issue: TIssue;
}
export default function MetaInfo({ issue }: MetaInfoProps) {
  return (
    <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
      <div className="flex items-center gap-2 font-thin">
        {isTooOldIssueCreatedAt(issue.created_at) ? (
          <FileWarning size={20} className="text-orange-600" />
        ) : (
          <Calendar size={20} className="text-primary" />
        )}
        <span>{formatTime(issue.created_at)}</span>
        <span>上次更新于 <ClientFromNowTime updated_at={issue.updated_at} /></span>
      </div>
      <div className="flex w-full items-center justify-center">
        {issue.labels.map((label) => (
          <span
            key={label.id}
            className={cn(
              "px-2 py-1 text-xs rounded-md mr-2 transition-all duration-300 text-[var(--label-color)] bg-[var(--label-bg-color)]"
            )}
            style={{
              ["--label-color" as any]: `#${label.color}`,
              ["--label-bg-color" as any]: `#${label.color}20`,
            }}
          >
            {label.name}
          </span>
        ))}
      </div>
    </div>
  );
}
