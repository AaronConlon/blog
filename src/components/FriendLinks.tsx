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
            className="flex items-center justify-center w-8 h-8 mx-2 rounded-full bg-gray-200 dark:bg-gray-800"
          >
            <Image
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
