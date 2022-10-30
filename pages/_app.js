import Head from 'next/head';
import NavigationHeader from '../components/NavigationHeader/NavigationHeader';

import '../styles/globals.scss';
import '../styles/colors.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head><title>Nostr Explorer</title></Head>

      <NavigationHeader />
      <Component {...pageProps} />
    </>
  );
}
