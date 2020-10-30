import axios from "axios";
import React from "react";
import styles from "../styles/search.module.sass";

const assertPrefix = "/qinyouyi_blog";
export default function Search({ callback }: { callback: Function }) {
  const searchRef = React.useRef(null);
  const handleSearch = (event) => {
    axios
      .get(`${assertPrefix}/api/search?keyword=${searchRef.current.value}`)
      .then((response) => {
        callback(response.data);
      })
      .catch((error) => {
        callback(error);
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
