import Link from "next/link";
import LinkIcon from "../../../assets/icons/LinkIcon";

import styles from './IconLink.module.scss';

export default function IconLink({ href }) {
  return (
    <Link href={href} passHref>
      <a className={styles.linkIcon}><LinkIcon /></a>
    </Link>
  );
}
