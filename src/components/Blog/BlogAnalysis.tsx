"use client";

import { CONFIG } from "@/config";
import { useQuery } from "@/features/hooks/useQuery";
import { TIssue } from "@/features/types";

interface BlogAnalysisProps {
  issueNum: number;
}

export default function BlogAnalysis({ issueNum }: BlogAnalysisProps) {
  const { data, loading, error } = useQuery<TIssue>(async () => {
    const res = await fetch(
      `https://api.github.com/repos/${CONFIG.author.name}/blog/issues/${issueNum}`
    );
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Failed to fetch data");
    }
  });

  const onClickReactions = async (reaction: string) => {
    // need login
  };

  if (error || loading || !data) return <div></div>;

  return (
    <div className="flex flex-col gap-2 items-center justify-center sticky top-0 mt-[30vh]">
      <div className="flex gap-1 items-center text-md font-thin cursor-pointer">
        <span>👍</span>
        <span>{data.reactions["+1"]}</span>
      </div>
      <div className="flex gap-1 items-center text-md font-thin cursor-pointer">
        <span>👎🏻</span>
        <span>{data.reactions["+1"]}</span>
      </div>
      <div className="flex gap-1 items-center text-md font-thin cursor-pointer">
        <span>😁</span>
        <span>{data.reactions["+1"]}</span>
      </div>
      <div className="flex gap-1 items-center text-md font-thin cursor-pointer">
        <span>🎉</span>
        <span>{data.reactions["+1"]}</span>
      </div>
      <div className="flex gap-1 items-center text-md font-thin cursor-pointer">
        <span>🤔</span>
        <span>{data.reactions["+1"]}</span>
      </div>
      <div className="flex gap-1 items-center text-md font-thin cursor-pointer">
        <span>❤️</span>
        <span>{data.reactions["+1"]}</span>
      </div>
      <div className="flex gap-1 items-center text-md font-thin cursor-pointer">
        <span>🚀</span>
        <span>{data.reactions["+1"]}</span>
      </div>
      <div className="flex gap-1 items-center text-md font-thin cursor-pointer">
        <span>👀</span>
        <span>{data.reactions["+1"]}</span>
      </div>
    </div>
  );
}
