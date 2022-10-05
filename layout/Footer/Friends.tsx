import Link from "next/link";

function FriendLinks() {
  return (
    <div className="flex flex-wrap gap-2 items-center cursor-pointer">
      <Link href="https://submara.com/" target={"_blank"}>
        <img
          alt=""
          src="https://avatars.githubusercontent.com/u/30927318?v=4"
          className="w-10 h-10 rounded-full shadow-purple-200 shadow-sm"
        />
      </Link>
      <Link href="https://gujiwuqing.top" target={"_blank"}>
        <img
          alt=""
          src="https://avatars.githubusercontent.com/u/44566835?v=4"
          className="w-10 h-10 rounded-full shadow-purple-200 shadow-sm"
        />
      </Link>
      <Link href="https://www.wangmiaozero.cn/" target={"_blank"}>
        <img
          alt=""
          src="https://avatars.githubusercontent.com/u/45121589?v=4"
          className="w-10 h-10 rounded-full shadow-purple-200 shadow-sm"
        />
      </Link>
    </div>
  );
}

export default FriendLinks;
