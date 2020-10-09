// @ts-ignore
import Navbar from "./Navbar.tsx";

export default function GithubStatus({
  username,
  w = "702px",
}: {
  username: string;
  w: string;
}) {
  const githubHomepageUrl = `https://github.com/${username}`;
  const githubStatusSrc = `https://ghchart.rshah.org/${username}`;
  return (
    <div style={{ width: w }}>
      <a href={githubHomepageUrl}>
        <img src={githubStatusSrc} alt="" />
      </a>
      <Navbar />
      <style jsx>
        {`
          div {
            padding: 0.5rem;
            background-color: white;
            border-radius: 4px;
          }
          @media (max-width: 480px) {
            div {
              width: 100% !important;
            }
          }
          a {
            display: block;
            margin: 0 auto;
            width: 100%;
          }
          img {
            max-width: 100%;
          }
        `}
      </style>
    </div>
  );
}
