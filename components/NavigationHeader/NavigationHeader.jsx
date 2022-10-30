import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import EventSearchBar from "../EventSearchBar/EventSearchBar";
import styles from './NavigationHeader.module.scss';

export default function NavigationHeader(props) {

  // const router = useRouter();

  return (
    <header className={styles.navigation}>
      <div className={styles.innerContainer}>
        <div className={styles.logo}>
          <Link href="/" passHref>
            <a>
              <img alt="Nostr logo" src="/nostr_explorer_logo.png" />
              <h1>Nostr <strong>Explorer</strong></h1>
            </a>
          </Link>
        </div>

        <EventSearchBar />
      </div>
    </header>
  )
}
