import Blogs from "@/components/Blogs";
import Contact from "@/components/Contact";
import DescriptionMe from "@/components/DescriptionMe";
import WhoAmI from "@/components/DoingLately";
import FeatureProjects from "@/components/FeatureProjects";
import FriendLinks from "@/components/FriendLinks";
import GoTop from "@/components/GoTop";
import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";
import RevealOnView from "@/components/RevealOnView";
import SideBar from "@/components/Sidebar";
import Link from "next/link";

export default function Home() {
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
                    最近在做什么？
                  </span>
                  <span className="inline-block sm:hidden">近况</span>
                </Link>
              </li>
              <li>
                <Link href="#projects">项目</Link>
              </li>
              <li>
                <Link href="#blog">博客</Link>
              </li>
              <li>
                <Link href="#contact">联系</Link>
              </li>
            </ul>
            <MobileNav />
          </nav>
        </div>
      </header>
      <main className="relative">
        <RevealOnView>
          <DescriptionMe />
        </RevealOnView>
        <RevealOnView>
          <WhoAmI />
        </RevealOnView>
        <RevealOnView>
          <FeatureProjects />
        </RevealOnView>
        <RevealOnView>
          <Blogs />
        </RevealOnView>
        <RevealOnView>
          <Contact />
        </RevealOnView>
        <SideBar />
      </main>
      <FriendLinks />
      <GoTop />
    </>
  );
}
