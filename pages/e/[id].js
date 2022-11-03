import Head from 'next/head'

import {getEvent} from '../../utils/get-event'
import EventDetails from '../../components/EventDetails/EventDetails'
import { EventKinds } from '../../utils/nostr';

export async function getServerSideProps(context) {
  const { id } = context.params;
  let channelEvent = null;

  const event = await getEvent(id);

  // TODO -> parse e tags correctly (this is deprecated but still used by anigma.io)
  if (event?.kind === EventKinds.CHANNEL_MESSAGE) {
    const eTags = event.tags.filter(tag => tag[0] === 'e');
    const [, channel] = eTags?.[0] || [];

    if (channel) {
      channelEvent = await getEvent(channel);
      channelEvent.__content = JSON.parse(channelEvent.content);
    }
  }

  // if the event exists, cache forever, if not, cache for 360 seconds:
  if (event) {
    context.res.setHeader('Cache-Control', 'public, s-maxage=31536000');
  } else {
    context.res.statusCode = 404;
    context.res.setHeader('Cache-Control', 'public, s-maxage=360');
  }

  return { props: { id, event, channelEvent } };
}

export default function EventPage({ id, event, channelEvent }) {
  return (
    <>
      <Head><title>Nostr Event – {id}</title></Head>
      {/* <Event id={id} event={event} /> */}
      <EventDetails id={id} event={event} channelEvent={channelEvent} />
    </>
  )
}
