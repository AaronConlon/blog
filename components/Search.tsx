import React from "react";
import styles from "../styles/search.module.sass";

export default function Search() {
  const searchRef = React.useRef(null);
  const handleSearch = (event) => {
    console.log("ok", searchRef.current.value);
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
      />
      <button type="submit">search</button>
    </form>
  );
}
