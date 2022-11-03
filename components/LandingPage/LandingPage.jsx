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

      <div>
        Sample Events
        <ul>
          <li>encryped DM: 4a887bf80ef12fdff7e22691a19b32f497dd0d0f46a4f8a92502f399b4c076da</li>
          <li>reply channel chat: b2ea3ea43d2fd2873a9b3191a8e5fdef381ebf2a1c56ca909861fe9489671c65</li>
          <li>my own encrypted DM: aaa2b9f0814a87d8ed5b5ad1cc543fec77386d75a9bf82fa80746eda48c5f565</li>
        </ul>
      </div>
    </main>
  );
}
