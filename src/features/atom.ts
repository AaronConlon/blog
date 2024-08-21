"use client";

import { atomWithStorage } from "jotai/utils";
import { ILocalIssue, IUserInfo } from "./types";

export const localIssuesAtom = atomWithStorage<ILocalIssue[]>(
  "localIssues",
  [],
  undefined,
  {
    getOnInit: true,
  }
);

export const localTokenAtom = atomWithStorage(
  "localToken",
  globalThis?.localStorage?.getItem("localToken")?.replace(/"/gi, "") ?? ""
);

export const localUserInfo = atomWithStorage<IUserInfo>(
  "userInfo",
  JSON.parse(globalThis?.localStorage?.getItem("userInfo") ?? "{}")
);
