import { useAtom } from "jotai";
import { localIssuesAtom } from "../atom";

export const useLocalIssues = () => {
  return useAtom(localIssuesAtom);
};
