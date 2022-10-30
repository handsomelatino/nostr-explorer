import { useRouter } from 'next/router';
import LandingPage from '../components/LandingPage/LandingPage';

export default function Home() {
  const router = useRouter()

  return (
    <>
      <LandingPage />
      <div className="nes-container">

        <h2>What is Nostr?</h2>
        <p>
          A decentralized network based on cryptographic keypairs and that is not
          peer-to-peer, it is super simple and scalable and therefore has a chance
          of working.
        </p>
        <p>
          Read more at{' '}
          <a href="https://github.com/nostr-protocol/nostr">
            https://github.com/nostr-protocol/nostr
          </a>
          .
        </p>
        <p>
          You can also reach us at{' '}
          <a href="https://t.me/nostr_protocol">our Telegram group</a> while we
          don&apos;t have a decent group chat application fully working on Nostr.
        </p>

        <br />

        <h2>Contribute to this site!</h2>
        <p>
          You can find the source code for this gateway website at{' '}
          <a href="https://github.com/fiatjaf/nostr-gateway">
            https://github.com/fiatjaf/nostr-gateway
          </a>{' '}
          while we haven&apos;t finished implementing Git over Nostr yet.
        </p>
      </div>
    </>
  );
}
