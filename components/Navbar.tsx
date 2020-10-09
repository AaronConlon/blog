import Link from "next/link";
import React from "react";

export default function Navbar() {
  const [showWechatImg, setShowWechatImg] = React.useState(false);
  function handdleClick() {
    setShowWechatImg(!showWechatImg);
  }
  return (
    <div>
      {showWechatImg ? (
        <div
          id="wechat"
          onClick={handdleClick}
          aria-hidden="true"
          aria-label="hidden wechat card"
        >
          <img src="/wechat.jpeg" alt="wechat" />
          <img src="/wechat-public.jpeg" alt="公众号" />
        </div>
      ) : (
        <ul>
          <li>
            <Link href="/">
              <a>
                <span role="img" aria-label="homepage">
                  🏠
                </span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://github.com/youyiqin/books">
              <a>
                <span role="img" aria-label="books">
                  📚
                </span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/posts">
              <a>
                <span role="img" aria-label="posts">
                  ✍️
                </span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/projects">
              <a>
                <span role="img" aria-label="projects">
                  🔥
                </span>
              </a>
            </Link>
          </li>
          <li id="zhihu">
            <a href="https://zhihu.com" target="_blank" rel="noreferrer">
              知
            </a>
          </li>
          <li>
            <a
              href="mailto:rivenqinyy@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              <span role="img" aria-label="send mail">
                📧
              </span>
            </a>
          </li>
          <li>
            <span
              role="img"
              onClick={handdleClick}
              aria-hidden="true"
              aria-label="show wechat card"
            >
              💬
            </span>
          </li>
        </ul>
      )}

      <style jsx>
        {`
          div {
            margin: 0.4rem 0 0;
            background-color: skyblue;
          }
          ul {
            display: flex;
            justify-content: center;
            align-items: center;
            list-style-type: none;
            width: 100%;
          }
          li {
            display: inline-block;
            margin: 0.4rem 0.5rem;
          }
          a {
            text-decoration: none;
            text-transform: uppercase;
            color: blue;
          }
          span {
            cursor: pointer;
          }
          span::after {
            content: ".";
            position: relative;
            left: -0.7rem;
            top: 0.6rem;
            color: blue;
          }
          #zhihu::after {
            content: ".";
            color: blue;
            position: relative;
            left: -0.6rem;
            top: 0.6rem;
          }
          #wechat {
            margin: 0;
            padding: 0;
            position: absolute;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #wechat img {
            width: 12rem;
            height: 12rem;
            margin: 0 1rem;
            border-radius: 6px;
          }
        `}
      </style>
    </div>
  );
}
