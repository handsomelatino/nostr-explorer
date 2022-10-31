import Head from 'next/head'

import {getEvent} from '../../utils/get-event'
import EventDetails from '../../components/EventDetails/EventDetails'

export async function getServerSideProps(context) {
  const { id } = context.params;
  const event = await getEvent(id);

  // parse child events to load replies and such
  // console.log('event:', event)

  // if (event?.kind === 42) {
  //   const [_, channel] = event.tags[0];
  //   console.log('channel:', channel);

  //   const channelEvent = await getEvent(channel);
  //   console.log('channelEvent:', channelEvent)
  // }

  if (event) {
    // event exists, cache forever
    context.res.setHeader('Cache-Control', 'public, s-maxage=31536000');
  } else {
    // event doesn't exist, cache for a while
    context.res.statusCode = 404;
    context.res.setHeader('Cache-Control', 'public, s-maxage=360');
  }

  return { props: { id, event } };
}

export default function EventPage({id, event}) {
  return (
    <>
      <Head><title>Nostr Event – {id}</title></Head>
      {/* <Event id={id} event={event} /> */}
      <EventDetails id={id} event={event} />
    </>
  )
}
