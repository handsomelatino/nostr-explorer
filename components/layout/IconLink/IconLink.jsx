import Link from "next/link";
import LinkIcon from "../../../assets/icons/LinkIcon";

import styles from './IconLink.module.scss';

export default function IconLink({ href }) {

  if (href) {
    return (
      <Link href={href} passHref>
        <a className={styles.linkIcon}><LinkIcon /></a>
      </Link>
    );
  }

  return (
    <span className={styles.linkIcon}><LinkIcon /></span>
  );
}
