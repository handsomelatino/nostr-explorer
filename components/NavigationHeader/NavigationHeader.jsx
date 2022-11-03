import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import EventSearchBar from "../EventSearchBar/EventSearchBar";
import styles from './NavigationHeader.module.scss';

const EVENT_ANCHORS = [
  { phrase: "Event",   link: "event" },
  { phrase: "Details", link: "details" },
  { phrase: "Tags",    link: "tags" },
  { phrase: "JSON",    link: "json" },
]
export default function NavigationHeader(props) {

  const router = useRouter();

  const isEventPage = router.pathname === '/e/[id]';

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

        { isEventPage && (
          <div className={styles.eventShortcuts}>
            { EVENT_ANCHORS.map(event => (
              <a key={event.phrase} href={`#${event.link}`}>{ event.phrase }</a>
            ))}
            <div className={classNames(styles.edge, styles.leftEdge)} />
            <div className={classNames(styles.edge, styles.rightEdge)} />

            <div className={classNames(styles.edgeFilling, styles.leftEdge)} />
            <div className={classNames(styles.edgeFilling, styles.rightEdge)} />
          </div>
        )}

        <div className={styles.search}><EventSearchBar /></div>
      </div>
    </header>
  )
}
