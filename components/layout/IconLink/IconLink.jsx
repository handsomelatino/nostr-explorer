import classNames from "classnames";
import Link from "next/link";
import LinkIcon from "../../../assets/icons/LinkIcon";

import styles from './IconLink.module.scss';

export default function IconLink({ href, size }) {

  const classes = classNames(styles.linkIcon, { [styles[`size-${size}`]]: size });

  if (href) {
    return (
      <Link href={href} passHref>
        <a className={classes}><LinkIcon /></a>
      </Link>
    );
  }

  return (
    <span className={classes}><LinkIcon /></span>
  );
}
