import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { hexToNpub, kindNames } from '../../utils/nostr';

import EventTags from './EventTags';

import SignatureIcon from '../../assets/icons/SignatureIcon';
import IconLink from '../layout/IconLink/IconLink';
import styles from './EventDetails.module.scss';

export default function EventDetails({ id, event }) {

  const [verifying, setVerifying] = useState(false);
  const [signatureValid, setSignatureValid] = useState(null);
  const [verifyTime, setVerifyTime] = useState(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const eventContentJson = useMemo(() => {
    try {
      return (JSON.stringify(JSON.parse(event.content), null, 2));
    }
    catch {
      return null;
    }
  }, [event]);

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
  const jsonName = `nostr_event_${id.slice(0, 8)}.json`;

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

  const renderEventContent = () => {
    if (eventContentJson) {
      return (
        <>
          <span className={styles.jsonTag}>JSON</span>
          <pre><code>{ eventContentJson }</code></pre>
        </>
      )
    }

    return event.content;
  }

  return (
    <main className={styles.eventDetails}>
      <div className={styles.innerContainer} id='event'>
        <div className={styles.title}>
          <h2>Event</h2>
          <code className={styles.hash}>{ id }</code>
          <button className={classNames(styles.outlineButton, { [styles.error]: signatureValid === false })} onClick={verifySignature} disabled={verifying || signatureValid !== null}>{ renderVerify() }</button>
          <div className={classNames(styles.verification, { [styles.invisible]: signatureValid === null, [styles.error]: signatureValid === false })}>
            { signatureValid
            ? <>Verified in { (verifyTime / 1000).toFixed(verifyTime >= 10 ? 2 : 4) }s</>
            : <>This event is malformed or may have been tampered with. Do not trust its content.</>
            }
          </div>
        </div>

        <section className={styles.eventInfo}>
          <div className={styles.authorRow}>
            <div className={styles.label}>
              Author Pubkey
              <div className={styles.help}><span>?</span></div>
            </div>
            <div>
              <code className={styles.hash}>{ hexToNpub(event.pubkey) }</code>
              <IconLink href={`/p/${hexToNpub(event.pubkey)}`} />
            </div>
          </div>

          <div className={styles.infoRow}>
            <div>
              <span className={styles.label}>Created</span>
              <span>{ createdAt } <span className={styles.timeAgo}>({relativeTime})</span></span>
            </div>

            <div>
              <span className={styles.label}>Type</span>
              <span>{ kindNames[event.kind] || '' }</span>
              <span className={styles.kindNumber}>{ event.kind }</span>
            </div>
          </div>
        </section>

        <section id='content'>
          <div className={styles.secondaryTitle}>
            <h3>Content</h3>
          </div>
          <div className={classNames(styles.content, { [styles.isJson]: eventContentJson })}>
          { renderEventContent() }
          </div>
        </section>

        <section id='tags'>
          <div className={styles.secondaryTitle}>
            <h3>Tags</h3>
          </div>
          <div className={styles.tags}><EventTags event={event} /></div>
        </section>

        <section id="json">
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
