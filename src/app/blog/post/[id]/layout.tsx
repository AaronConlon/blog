import GiscusContainer from "@/components/Blog/Giscus";
import FriendLinks from "@/components/FriendLinks";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 在这里引入 CDN CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.6.1/github-markdown.min.css"
        integrity="sha512-heNHQxAqmr9b5CZSB7/7NSC96qtb9HCeOKomgLFv9VLkH+B3xLgUtP73i1rM8Gpmfaxb7262LFLJaH/hKXyxyA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      {children}
      <GiscusContainer />
      <FriendLinks />
    </>
  );
}
