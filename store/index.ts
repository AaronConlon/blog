import { atom, useAtom } from "jotai";

import { IUserInfo } from "@/interfaces/userInfo";

// Create your atoms and derivatives
export const userInfoAtom = atom<IUserInfo>({});
export const tabAtom = atom("CSS");
