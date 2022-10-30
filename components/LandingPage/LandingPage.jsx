import EventSearchBar from '../EventSearchBar/EventSearchBar';
import styles from './LandingPage.module.scss';

export default function LandingPage() {
  return (
    <main className={styles.landingPage}>
      <section className={styles.aboveTheFold}>
        <h1>Nostr<strong>Explorer</strong></h1>
        <div className={styles.searchBar}><EventSearchBar /></div>

        <div className={styles.decentralized}>
          <h2>A Decentralized Network</h2>
          <p><strong>Nostr</strong> is a censorship-resistant, open protocol where information can take many shapes: social media interactions, chat, private messages, and much more.</p>
        </div>
      </section>
    </main>
  );
}
