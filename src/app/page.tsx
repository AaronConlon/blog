import Blogs from "@/components/Blogs";
import Contact from "@/components/Contact";
import DescriptionMe from "@/components/DescriptionMe";
import WhoAmI from "@/components/DoingLately";
import FeatureProjects from "@/components/FeatureProjects";
import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";
import SideBar from "@/components/Sidebar";
import { buildRssFile } from "@/features/rss";
import Link from "next/link";



export default async function Home() {
  await buildRssFile();

  return (
    <>
      <header className="bg:white border-b-gray-100 border-b-[2px] text-black  sticky top-0 bg-white z-50">
        <div className="flex sm:mx-auto items-center gap-4 w-full xl:max-w-[1200px] justify-between p-4 bg-white text-xl">
          <Logo />
          <nav>
            <ul className="md:flex gap-4 hidden">
              <li>
                <Link href="#doing-lately">
                  <span className="hidden sm:inline-block">
                    What am I doing lately?
                  </span>
                  <span className="inline-block sm:hidden">donging lately</span>
                </Link>
              </li>
              <li>
                <Link href="#projects">Projects</Link>
              </li>
              <li>
                <Link href="#blog">Blog</Link>
              </li>
              <li>
                <Link href="#contact">Contact</Link>
              </li>
            </ul>
            <MobileNav />
          </nav>
        </div>
      </header>
      <main className="relative">
        <DescriptionMe />
        <WhoAmI />
        <FeatureProjects />
        <Blogs />
        <Contact />
        <SideBar />
      </main>
    </>
  );
}
