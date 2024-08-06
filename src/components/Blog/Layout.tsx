import Logo from "@/components/Logo";
import { getCacheLabels } from "@/features/cache";
import ActiveLink from "../ActiveLink";
import SocialMediaSidebar from "../Sidebar/SocialMediaSidebar";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const labels = await getCacheLabels();
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-gradient-to-bl from-gray-50 to-white p-4 inset-x-0 transition-all header">
        <nav className="max-w-[1200px] mx-auto">
          <ul className="flex items-center justify-end gap-.5 md:gap-1 xl:gap-4">
            <li className="mr-auto">
              <Logo />
            </li>
            {labels.map(({ name, id, color }) => (
              <li
                key={id}
                style={{
                  ["--color" as any]: `#${color}1a`,
                }}
              >
                <ActiveLink
                  className="px-1.5 py-.5 rounded-sm hover:bg-[var(--color)]"
                  href={`/blog/tag/${id}`}
                  style={{
                    color: `#${color}`,
                  }}
                >
                  {name}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {children}
      <SocialMediaSidebar />
    </>
  );
}
