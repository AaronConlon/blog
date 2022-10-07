import Link from "next/link";

function ServerError() {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-white flex items-center justify-center flex-col gap-8">
      <img alt="not found" src="/500.svg" className="w-128 h-128" />
      <p>我炸了，但你可以...</p>
      <Link href="/">
        <p className="bg-purple-400 text-white p-1 px-2 rounded-sm cursor-pointer">
          回头再试试
        </p>
      </Link>
    </div>
  );
}

export default ServerError;
