import BlogLayout from "@/components/Blog/Layout";
import { resolveIssueBody } from "@/features/format";
import { TIssue } from "@/features/types";
import { format } from "date-fns";
import { CalendarCheck } from "lucide-react";
import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";

export default function BlogContainer({
  issues,
  labelName,
}: {
  issues: TIssue[];
  labelName?: string;
}) {
  return (
    <BlogLayout>
      <div className="mx-auto max-w-[1000px] p-4">
        <h3 className="text-primary font-semibold text-2xl mt-4">
          <span
            className="section-heading"
            data-type="highlight"
            data-color="#fff176"
          >
            {labelName ? `分类：${labelName}` : "所有分类"}
          </span>
        </h3>
        {issues.length === 0 ? (
          <div className="py-12">
            <Image
              src="https://de4965e.webp.li/blog-images/2024/08/f8932d9f7cb62ab596b96d6c9a4c9a23.svg"
              alt="Empty"
              width={400}
              height={400}
              className="mx-auto"
            />
            <div>
              <p className="text-center text-gray-400 dark:text-gray-500">
                暂无文章
              </p>
            </div>
          </div>
        ) : (
          <p className="py-4">
            当前共 <span>{issues.length} 篇文章</span>
          </p>
        )}
        <div className="py-12 min-h-[20vh]">
          <ol className="relative border-s border-gray-200 dark:border-gray-700">
            {issues.map(({ id, title, updated_at, labels, body, html_url }) => {
              const { data } = resolveIssueBody(body);
              return (
                <li className="mb-10 ms-4" key={id}>
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <CalendarCheck size={16} className="-mr-2" />
                    <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      {format(new Date(updated_at), "yyyy年MM月dd日")}
                    </time>
                    <div className="flex items-center">
                      {labels.map(({ name, color, id }) => (
                        <span
                          key={id}
                          className="px-2 py-1 ml-2 text-xs font-medium leading-none rounded-full"
                          style={{
                            color: `#${color}`,
                            backgroundColor: "#" + color + "2a",
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-[auto_200px] gap-4">
                    <div>
                      <Link
                        href={`/blog/post/${id}`}
                        target="_blank"
                        className="text-lg mb-4 font-semibold text-gray-900 dark:text-white"
                      >
                        {title}
                      </Link>
                      {data?.description && (
                        <div
                          className="my-2 max-w-[800px] text-base font-normal text-gray-500 dark:text-gray-400"
                          dangerouslySetInnerHTML={{
                            __html: marked(data?.description ?? "忘了总结"),
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        {issues.length > 0 && (
          <div className="font-thin text-md text-primary mb-4 flex items-center gap-4 justify-center">
            <span className="w-8 bg-primary/10 h-[2px] inline-block"></span>
            到底了
            <span className="w-8 bg-primary/10 h-[2px] inline-block"></span>
          </div>
        )}
        <Link
          className="font-semibold text-xl underline underline-offset-2"
          href={labelName ? "/blog" : "/"}
        >
          cd ..
        </Link>
      </div>
    </BlogLayout>
  );
}
