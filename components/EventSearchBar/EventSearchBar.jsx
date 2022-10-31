import { useRouter } from "next/router";
import { useState } from "react";

import SearchIcon from "../../assets/icons/SearchIcon";
import styles from './EventSearchBar.module.scss';

export default function EventSearchBar(props) {

  const router = useRouter();

  const onSubmitSearch = e => {
    e.preventDefault();
    router.push(`/${search}`);
  }

  const [search, setSearch] = useState(null);

  return (
    <form onSubmit={onSubmitSearch} className={styles.search}>
      <input name="input" value={search} spellCheck={false} placeholder="Event hex ID or user pubkey (npub)" onChange={e => setSearch(e.target.value)} />
      <button disabled={!search} type="submit" className="">
        <SearchIcon />
        <span className={styles.searchText}>Search</span>
      </button>
    </form>
  );
}
