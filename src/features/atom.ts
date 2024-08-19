"use client";

import { atomWithStorage } from "jotai/utils";
import { ILocalIssue } from "./types";

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
  globalThis?.localStorage?.getItem("localToken") ?? ""
);
