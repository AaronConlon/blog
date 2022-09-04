import Image from "next/image";
import Link from "next/link";
import CustomImage from "../CustomImage";

interface IProps {
  intro: string;
  tags: string[];
  title: string;
  date: string;
  coverImg: string;
}
function MiniArticle({ intro, tags, title, date, coverImg }: IProps) {
  const myLoader = ({ src, width }) => {
    console.log(src, width);
    const result = `${src.replace(/=\d+$/, "=")}${width}`;
    // console.log(result);
    return result;
  };
  return (
    <div className="flex">
      <CustomImage src={coverImg} width={400} height={200} />
      <div className="p-4 flex flex-col flex-grow border-purple-200 rounded-md rounded-l-none border border-l-transparent">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="flex-grow p-4 text-gray-600">{intro}</p>
        <div className="flex gap-2">
          <span className="mr-auto">{date}</span>
          {tags.map((i, idx) => (
            <Link href={`/tags?name=${i}`} key={idx}>
              <a className="px-2 py-1 bg-purple-100 rounded-md opacity-80 hover:opacity-100">
                # {i}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MiniArticle;
