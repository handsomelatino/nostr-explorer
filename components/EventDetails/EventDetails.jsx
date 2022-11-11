import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { hexToNpub, EventNames, shortenEventId } from '../../utils/nostr';
import styles from './EventDetails.module.scss';

import EventTags from './EventTags';
import IconLink from '../layout/IconLink/IconLink';

import SignatureIcon from '../../assets/icons/SignatureIcon';
import { getEventTime } from '../../utils/dateFormat';

export default function EventDetails({ id, event, channelEvent }) {

  const [verifying, setVerifying] = useState(false);
  const [signatureValid, setSignatureValid] = useState(null);
  const [verifyTime, setVerifyTime] = useState(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showJsonHelp, setShowJsonHelp] = useState(false);
  const [npubFormat, setNpubformat] = useState(true);

  useEffect(() => {
    setVerifying(false);
    setSignatureValid(null);
  }, [event]);

  const replyTo = useMemo(() => {
    const eTags = event?.tags.filter(tag => tag[0] === 'e');
    return eTags?.[1]?.[1] || undefined;
  }, [event]);

  const eventContentJson = useMemo(() => {
    try {
      return (JSON.stringify(JSON.parse(event.content), null, 2));
    }
    catch {
      return null;
    }
  }, [event]);

  const eventJson = useMemo(() => JSON.stringify(event, null, 2), [event]);
  const [createdAt, relativeTime] = useMemo(() => event ? getEventTime(event.created_at) : [], [event]);

  if (!event) {
    return (
      <div>Event not found.</div>
    )
  }

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
            : <>This event is malformed or may have been tampered with. Do not trust any part of its content.</>
            }
          </div>
        </div>

        <section id='content'>
          <div className={classNames(styles.content, { [styles.isJson]: eventContentJson, [styles.isText]: !eventContentJson })}>
            { !eventContentJson && <div className={styles.openQuotation}>“ </div> }
            { renderEventContent() }
          </div>
          { channelEvent && <div className={styles.postedChannel}>Posted { replyTo && <span className={styles.inResponse}>in response to message <Link href={`/e/${replyTo}`} passHref><a>{ shortenEventId(replyTo) }<IconLink size='small' /></a></Link></span> } on channel <Link href={`/e/${channelEvent.id}`} passHref><a>«{ channelEvent.__content.name }»<IconLink size='small' /></a></Link></div> }
        </section>

        <section id='details'>
          <div className={styles.secondaryTitle}>
            <h3>Details</h3>
          </div>
          <div className={styles.eventInfo}>
            <div className={styles.authorRow}>
              <div className={styles.label}>
                Author Pubkey
                <div className={styles.help}><span>?</span></div>
              </div>
              <div>
                <code className={styles.hash}>{ npubFormat ? hexToNpub(event.pubkey) : event.pubkey }</code>
                <IconLink href={`/p/${hexToNpub(event.pubkey)}`} />
              </div>
              <button className={classNames(styles.keyFormat, { [styles.smaller]: !npubFormat })} onClick={() => setNpubformat(!npubFormat)}>
                { npubFormat ? 'HEX' : 'npub' }
              </button>
            </div>

            <div className={styles.infoRow}>
              <div>
                <span className={styles.label}>Created</span>
                <span>{ createdAt } <span className={styles.timeAgo}>({relativeTime})</span></span>
              </div>

              <div>
                <span className={styles.label}>Kind</span>
                <span>{ EventNames[event.kind] || '' }</span>
                <span className={styles.kindNumber}>{ event.kind }</span>
              </div>
            </div>
          </div>
        </section>

        <section id='tags'>
          <div className={styles.secondaryTitle}>
            <h3>Tags</h3>
          </div>
          <EventTags event={event} />
        </section>

        <section id="json">
          <div className={classNames(styles.secondaryTitle, {[styles.showingJsonHelp]: showJsonHelp })}>
            <div>
              <h3>JSON</h3>
              <div className={styles.help} role="button" onClick={() => setShowJsonHelp(!showJsonHelp)}><span>?</span></div>
            </div>

            <div>
              <span role='button' className={styles.copyJson} onClick={copyJson}>{ copiedJson ? 'Copied' : 'Copy'}</span>
              <a href={jsonData} download={jsonName} className={styles.outlineButton}>Download</a>
            </div>
          </div>

          <div className={styles.jsonHelp}>
            { showJsonHelp && <>JSON is an open-standard format for information exchange that is easy for both computers and humans to understand. Nostr events are exchanged using JSON between relays and clients. <span role='button' onClick={() => setShowJsonHelp(false)}>Hide</span></> }
          </div>
          <div className={styles.json}>
            <pre><code>{ eventJson }</code></pre>
          </div>
        </section>
      </div>
    </main>
  );
}
