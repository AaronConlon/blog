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

export const localTokenAtom = atomWithStorage<string | null>(
  "localToken",
  null,
  undefined,
  {
    getOnInit: true,
  }
);
