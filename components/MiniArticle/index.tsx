import CustomImage from "../CustomImage";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface IProps {
  intro: string;
  tags: string[];
  title: string;
  date: string;
  coverImg: string;
}
function MiniArticle({ intro, tags, title, date, coverImg }: IProps) {
  const myLoader = ({ src, width }) => {
    // console.log(src, width);
    const result = `${src.replace(/=\d+$/, "=")}${width}`;
    // console.log(result);
    return result;
  };
  return (
    <div className="flex flex-col items-stretch">
      {/* <CustomImage src={coverImg} width={400} height={200} /> */}
      <img src={coverImg} alt="img" />
      <div className="p-4 flex flex-col flex-grow  rounded-md">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="flex-grow p-4 py-12 text-gray-600">{intro}</p>
        <div className="flex gap-2">
          <span className="text-sm w-[200px] opacity-40 self-end">
            {format(new Date(date), "yyyy年MM月dd")}
          </span>
          <div className="flex gap-2 flex-wrap justify-end items-center flex-grow">
            {tags.map((i, idx) => (
              <Link href={`/tags?name=${i}`} key={idx}>
                <a className="px-2 py-1 italic bg-black text-white rounded-md opacity-80 hover:opacity-100 hover:bg-purple-600 hover:text-light-100 text-sm transition-all">
                  # {i}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniArticle;
