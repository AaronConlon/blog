"use client";

import { testToken } from "@/features/api";
import { localIssuesAtom, localTokenAtom } from "@/features/atom";
import { ILocalIssue, TIssue, TLabel } from "@/features/types";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiCloudOff, CiCloudOn } from "react-icons/ci";
import { PiPasswordThin } from "react-icons/pi";
import NewIssue from "./NewIssue";
import RecentIssues from "./RecentIssues";
import VditorComponent from "./VditorComponent";

interface EditorPageProps {
  issues: Partial<TIssue>[];
  labels: TLabel[];
}

export default function EditorPage({
  issues: _issue,
  labels: _labels,
}: EditorPageProps) {
  const [issues, setIssues] = useState(_issue);
  const [labels, setLabels] = useState(_labels);

  const [local, setLocal] = useState(!false);
  const [currentIssue, setCurrentIssue] = useState<TIssue | ILocalIssue>();
  const setToken = useSetAtom(localTokenAtom);
  const localIssues = useAtomValue(localIssuesAtom);

  const onPickToEdit = (issueNumber: number) => {
    const issue = local
      ? localIssues.find((i) => i.number === issueNumber)
      : issues.find((i) => i.number === issueNumber);
    if (issue) {
      setCurrentIssue(issue as any);
    } else {
      toast.error("Issue not found");
    }
  };

  useEffect(() => {
    setCurrentIssue(undefined);
  }, [local]);

  return (
    <div className="grid grid-cols-[64px_760px_auto] h-screen overflow-hidden fixed inset-0 w-screen z-10 bg-white">
      <div className="bg-gray-50 h-screen flex flex-col items-center gap-4 py-4">
        {local ? (
          <CiCloudOn
            className="w-8 h-8 animate-fade-right"
            onClick={() => setLocal(false)}
          />
        ) : (
          <CiCloudOff
            className="w-8 h-8 animate-fade-left"
            onClick={() => setLocal(true)}
          />
        )}
        <PiPasswordThin
          className="w-8 h-8"
          onClick={() => {
            // get copy content from clipboard
            const clipboard = navigator.clipboard;
            toast.promise(
              (async () => {
                const token = await clipboard.readText();
                const isValid = await testToken(token);
                if (isValid) {
                  setToken(token);
                } else {
                  throw new Error("Invalid token");
                }
              })(),
              {
                loading: "Saving...",
                success: <b>Settings saved!</b>,
                error: <b>Could not save. Invalid token.</b>,
              }
            );
          }}
        />
        {/* new local issue */}
        <NewIssue labels={labels} />
      </div>
      <div>
        <RecentIssues
          isLocal={local}
          issues={local ? localIssues : issues}
          onPickToEdit={onPickToEdit}
        />
      </div>
      {currentIssue && (
        <VditorComponent
          issue={currentIssue}
          labels={labels}
          isLocalIssue={local}
          setIssues={setIssues}
        />
      )}
    </div>
  );
}
