import { labelsAtom, userInfoAtom } from "@/store";

import { GetStaticProps } from "next";
import { IRepoLabel } from "@/interfaces";
import { IUserInfo } from "@/interfaces/userInfo";
import { request } from "@/utils";
import { useEffect } from "react";
import { useSetAtom } from "jotai";

interface IProps {
  info: IUserInfo;
  labels: IRepoLabel[];
}

function IdeasPage({ info, labels }: IProps) {
  const setLabelStore = useSetAtom(labelsAtom);
  // @ts-ignore
  const setUserInfoStore = useSetAtom(userInfoAtom);

  /**
   * 还是对 React 和 NextJS 的机制不熟悉
   */
  useEffect(() => {
    setLabelStore({ isShow: false, list: labels });
    setUserInfoStore(info);
  }, [setLabelStore, setUserInfoStore, info, labels]);

  return (
    <div className="py-12">
      <img
        alt=""
        src="/empty.svg"
        className="sm:w-[80vw] md:w-[50vw] mx-auto"
      />
      <p className="text-center">我有很多好点子，待续...</p>
    </div>
  );
}

export default IdeasPage;

// return props to current page component as props
export const getServerSideProps: GetStaticProps = async (context) => {
  const [labels, info] = await Promise.all([
    request.get("/api/label"),
    request.get("/api/about"),
  ]);
  // 创建RSS文件
  return {
    props: {
      labels,
      info,
    },
  };
};
