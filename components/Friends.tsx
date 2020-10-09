export default function Friends({
  friends,
}: {
  friends: {
    name: string;
    avatar: string;
    homepage: string;
    isGirl: boolean;
  }[];
}) {
  return (
    <div style={{ margin: "2rem" }}>
      <h5>
        Friends
        <span role="img" aria-label="stars">
          ✨✨
        </span>
      </h5>
      {friends.map((friend) => (
        <a key={friend.name} href={friend.homepage}>
          <img
            src={friend.avatar}
            alt=""
            title={friend.name}
            style={{ borderColor: friend.isGirl ? "pink" : "shyblue" }}
          />
        </a>
      ))}
      <style jsx>
        {`
          div {
            max-width: 400px;
          }
          img {
            display: inline-block;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            margin: 0.2rem 0.1rem;
            border: 2px solid grey;
            transition: all 0.7s;
          }
          img:hover {
            border-color: white !important;
            transform: scale(1.2, 1.2);
          }
          h5 {
            text-align: center;
            margin-bottom: 1rem;
            color: blue;
          }
        `}
      </style>
    </div>
  );
}
