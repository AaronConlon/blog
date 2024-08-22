"use client";

import Loading from "@/app/loading";
import { testToken } from "@/features/api";
import {
  localIssuesAtom,
  localTokenAtom,
  localUserInfo,
} from "@/features/atom";
import { ILocalIssue, TIssue, TLabel } from "@/features/types";
import { useAtom, useAtomValue } from "jotai";
import { isEmpty } from "lodash-es";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiCloudOff, CiCloudOn } from "react-icons/ci";
import NewIssue from "./NewIssue";
import RecentIssues from "./RecentIssues";
import VditorComponent from "./VditorComponent";

interface EditorPageProps {
  issues: Partial<TIssue>[];
  labels: TLabel[];
}

export default function EditorPage({
  issues: _issue,
  labels,
}: EditorPageProps) {
  const [issues, setIssues] = useState(_issue);
  const [local, setLocal] = useState(!false);
  const [currentIssue, setCurrentIssue] = useState<TIssue | ILocalIssue>();
  const [token, setToken] = useAtom(localTokenAtom);
  const localIssues = useAtomValue(localIssuesAtom);
  const [userInfo, setUserInfo] = useAtom(localUserInfo);

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (loading) {
      if (!isEmpty(token)) {
        console.log("token:", token);
        testToken(token, setUserInfo)
          .then((isValid) => {
            if (isValid) {
              toast("welcome back 🚀");
            } else {
              toast.error("Invalid token, please re-enter");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [token, loading, setUserInfo]);

  if (loading) {
    return <Loading />;
  }

  if (!token) {
    return (
      <div className="fixed z-50 w-screen h-screen flex justify-center items-center gap-2 animate-fade delay-1000 duration-1000">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h1 className="font-semibold text-primary text-lg mb-1">
            Please enter your token
          </h1>
          <input
            type="text"
            className="border border-gray-200 px-2 w-[600px] block rounded-sm py-1"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                const tokenString = e.currentTarget.value;
                testToken(tokenString, setUserInfo).then((isValid) => {
                  if (isValid) {
                    toast.success("Token saved");
                    setToken(tokenString);
                  } else {
                    toast.error("Invalid token");
                  }
                });
              }
            }}
            placeholder="ghp_..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[64px_300px_auto] 2xl:grid-cols-[64px_760px_auto] h-screen overflow-hidden fixed inset-0 w-screen z-10 bg-white">
      <div className="bg-gray-50 h-screen flex flex-col items-center gap-4 py-4">
        {local ? (
          <CiCloudOn className="w-8 h-8" onClick={() => setLocal(false)} />
        ) : (
          <CiCloudOff
            className="w-8 h-8 animate-fade-left"
            onClick={() => setLocal(true)}
          />
        )}
        {/* new local issue */}
        <NewIssue labels={labels} />
        {userInfo && (
          <Image
            className="mt-auto border border-primary rounded-full"
            src={userInfo.avatar_url}
            width={32}
            height={32}
            alt={userInfo.name}
          />
        )}
      </div>
      <div>
        <RecentIssues
          isLocal={local}
          issues={local ? localIssues : issues}
          onPickToEdit={onPickToEdit}
          setIssues={setIssues}
        />
      </div>
      {currentIssue ? (
        <VditorComponent
          issue={currentIssue}
          labels={labels}
          isLocalIssue={local}
          setIssues={setIssues}
        />
      ) : (
        <div className="flex justify-center items-center font-semibold text-primary text-2xl">
          no current issue...
        </div>
      )}
    </div>
  );
}
