import { atom, useAtom } from "jotai";

import { IRepoLabel } from "@/interfaces";
import { IUserInfo } from "@/interfaces/userInfo";

// Create your atoms and derivatives
export const userInfoAtom = atom<IUserInfo>({} as any);
export const tabAtom = atom("CSS");
export const labelsAtom = atom<{ list: IRepoLabel[]; isShow: boolean }>({
  isShow: false,
  list: [],
});
