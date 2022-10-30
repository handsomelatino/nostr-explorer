import { useMemo, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { hexToNpub } from '../../utils/nostr';

import LinkIcon from '../../assets/icons/LinkIcon';
import SignatureIcon from '../../assets/icons/SignatureIcon';

import styles from './EventDetails.module.scss';
import { DateTime } from 'luxon';

export default function EventDetails({ id, event }) {

  const [verifying, setVerifying] = useState(false);
  const [signatureValid, setSignatureValid] = useState(null);
  const [verifyTime, setVerifyTime] = useState(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const eventJson = useMemo(() => JSON.stringify(event, null, 2), [event]);

  const renderVerify = () => {
    if (signatureValid) {
      return <span>Valid</span>
    }
    else if (signatureValid === false) {
      return <span>Invalid</span>
    }

    return <><SignatureIcon /> <span>Verify</span></>
  }

  const verifySignature = () => {
    const startTime = performance.now();
    setVerifying(true);

    import('nostr-tools').then(({ verifySignature }) => {
      setSignatureValid(verifySignature(event));
      setVerifying(false);
      setVerifyTime(performance.now() - startTime);
    });
  }

  const copyJson = () => {
    navigator.clipboard.writeText(eventJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1000);
  }

  const jsonData = `data:text/plain;charset=UTF-8,${encodeURIComponent(eventJson)}`;
  const jsonName = `nostr_event_${id.slice(0, 8)}_json.txt`;

  const timeAgo = d => {
    let time;

    const ranges = ['years', 'months', 'days', 'hours'];
    const diff = DateTime.now().diff(d, ranges);

    ranges.some(range => {
      const value = Math.floor(diff.values[range]);

      if (value === 1) {
        // TODO -> use real locale instead of splitting the last 's'
        time = `one ${range.slice(0, -1)} ago`;
        return true;
      }
      else if (value > 1) {
        time = `${value} ${range} ago`;
        return true;
      }

      return false;
    });

    return time;
  }

  const date = DateTime.fromSeconds(event.created_at);
  const createdAt = `${date.toISODate()} ${date.toLocaleString(DateTime.TIME_24_SIMPLE)}`;
  const relativeTime = timeAgo(date);

  return (
    <main className={styles.eventDetails}>
      <div className={styles.innerContainer}>
        <div className={styles.title}>
          <h2>Event</h2>
          <code className={styles.hash}>{ id }</code>
          <button className={classNames(styles.outlineButton, { [styles.error]: signatureValid === false })} onClick={verifySignature} disabled={verifying || signatureValid !== null}>{ renderVerify() }</button>
        </div>
        { <div className={classNames(styles.verification, { [styles.invisible]: signatureValid === null, [styles.error]: signatureValid === false })}>
          { signatureValid
          ? <>Verified in { (verifyTime / 1000).toFixed(verifyTime >= 10 ? 2 : 4) }s</>
          : <>This event is malformed or may have been tampered with. Do not trust its content.</>
          }
        </div> }

        <section className={styles.eventInfo}>
          <div className={styles.authorRow}>
            <div className={styles.label}>
              Author Pubkey
              <div className={styles.help}><span>?</span></div>
            </div>
            <div>
              <code className={styles.hash}>{ hexToNpub(event.pubkey) }</code>
              <Link href={`/p/${hexToNpub(event.pubkey)}`} passHref>
                <a className={styles.pubkeyLink}><LinkIcon /></a>
              </Link>
            </div>
          </div>

          <div className={styles.infoRow}>
            Created

            { createdAt } ({relativeTime})
          </div>
        </section>

        <section>
          <div className={styles.secondaryTitle}>
            <div>
              <h3>JSON</h3>
              <div className={styles.help}><span>?</span></div>
            </div>

            <div>
              <span role='button' className={styles.copyJson} onClick={copyJson}>{ copiedJson ? 'Copied' : 'Copy'}</span>
              <a href={jsonData} download={jsonName} className={styles.outlineButton}>Download</a>
            </div>
          </div>

          <div className={styles.json}>
            <pre><code>{ eventJson }</code></pre>
          </div>
        </section>
      </div>
    </main>
  );
}