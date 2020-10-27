import axios from "axios";
import React from "react";
import styles from "../styles/search.module.sass";

export default function Search(props: { callback: Function }) {
  const callbackFn = props.callback;
  const searchRef = React.useRef("111");
  const handleSearch = (event) => {
    axios
      .get(`/api/search?keyword=${searchRef.current.value}`)
      .then((response) => {
        console.log(response.data);

        callbackFn(response.data);
      })
      .catch((error) => {
        callbackFn(error);
      });
    event.preventDefault();
  };
  return (
    <form onSubmit={handleSearch} className={styles.container}>
      <input
        type="search"
        placeholder="balabala..."
        id="search"
        name="search"
        ref={searchRef}
        aria-label="Search"
        required
      />
      <button type="submit">search</button>
    </form>
  );
}
