
import Image from "next/image";
export default function FriendLinks() {

  const friends = [
    {
      name: "Jimmy",
      avatar: "https://avatars.githubusercontent.com/u/65758455?s=48&v=4",
      href: "https://github.com/Jimmylxue/blog",
    },
    {
      href: "https://www.howie6879.com/",
      avatar: "https://avatars.githubusercontent.com/u/17047388?s=100&v=4",
      name: "老胡",
    },
    {
      href: "https://submara.com/",
      avatar: "https://avatars.githubusercontent.com/u/30927318?v=4",
      name: "Submara",
    },
    {
      href: "https://github.com/recallwei",
      avatar: "https://avatars.githubusercontent.com/u/62941121?v=4",
      name: "Bruce Song",
    },
    {
      href: "https://scarsu.com",
      avatar: "https://scarsu.com/images/profile_hd.jpg",
      name: "Scarsu",
    },
    {
      href: 'https://liuyuyang.net/',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=3311118881&s=640',
      name: '宇阳',
    },
    {
      href: 'https://blog.stv.lol',
      avatar: 'https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fdf8016f2-7cba-4365-a97c-23016c06db49%2Fa88a6550-7941-4c98-a278-136a72c04c4d%2F00119-3903136696%25E5%25B0%258F.jpeg?table=collection&id=1333fe3d-e6dc-8134-a1f0-000b0b277878&t=1333fe3d-e6dc-8134-a1f0-000b0b277878&width=800&cache=v2',
      name: "Steven Lynn's Blog"
    },
    {
      href: 'https://www.jimmy-blog.top/',
      avatar: 'https://avatars.githubusercontent.com/u/69883652?v=4',
      name: 'OJ·Jimmy (Other Jimmy)'
    },
    {
      name: "liruifengv - Web 开发者，Astro 项目成员，开源爱好者。",
      href: "https://liruifengv.com",
      avatar: "https://bucket.liruifengv.com/avatar.jpg",
    }
  ];

  return (
    <div className="my-20">
      <div className="flex justify-center">
        <h2 className="text-xl sm:text-2xl font-bold text-center section-heading mb-6">
          Friends
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[760px] px-8 flex items-center justify-center">
        {friends.map((friend, index) => (
          <a
            key={index}
            href={friend.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 mx-2 rounded-full bg-gray-200 dark:bg-gray-800 relative group"
          > 
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-100 text-primary text-center p-1 rounded-md w-max text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {friend.name}
            </div>

            <Image
              data-name={friend.name}
              width={24}
              height={24}
              src={friend.avatar}
              alt={friend.name}
              className="w-6 h-6 rounded-full"
            />
          </a>
        ))}
      </div>
    </div>
  );

}