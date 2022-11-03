import { bech32 } from 'bech32';

export const EventKinds = {
  METADATA                  : 0,
  TEXT                      : 1,
  RECOMMEND_RELAY           : 2,
  CONTACTS                  : 3,
  ENCRYPTED_DIRECT_MESSAGES : 4,
  EVENT_DELETION            : 5,
  REACTION                  : 7,
  CHANNEL_CREATION          : 40,
  CHANNEL_METADATA          : 41,
  CHANNEL_MESSAGE           : 42,
  CHANNEL_HIDE_MESSAGE      : 43,
  CHANNEL_MUTE_USER         : 44,
}

export const EventNames = {
  0  : 'Profile Metadata',
  1  : 'Text Note',
  2  : 'Relay Recommendation',
  3  : 'Contact List',
  4  : 'Encrypted Direct Message',
  5  : 'Event Deletion',
  7  : 'Reaction',
  40 : 'Channel Creation',
  41 : 'Channel Metadata',
  42 : 'Channel Message',
  43 : 'Hide Channel Message',
  44 : 'Mute Channel User',
};

export const relays = [
  'wss://nostr-pub.wellorder.net',
  'wss://nostr-verified.wellorder.net',
  'wss://nostr.rocks',
  'wss://relay.damus.io',
  'wss://nostr.drss.io',
  'wss://nostr.bitcoiner.social',
  'wss://nostr-relay.wlvs.space',
  'wss://nostr-relay.untethr.me',
  'wss://expensive-relay.fiatjaf.com',
  'wss://nostr-relay.freeberty.net',
  'wss://relay.minds.com/nostr/v1/ws'
];

export function nip05toURL(identifier) {
  const [name, domain] = identifier.split('@')
  return domain ? `https://${domain}/.well-known/nostr.json?name=${name}` : `https://${identifier}`
}

export function npubToHex(npub) {
  let {prefix, words} = bech32.decode(npub)
  if (prefix === 'npub') {
    let bytes = bech32.fromWords(words).slice(0, 32)
    let pubkey = Buffer.from(bytes).toString('hex')
    return pubkey
  }
  throw new Error('not an npub key')
}

export function hexToNpub(hex) {
  return bech32.encode('npub', bech32.toWords(Buffer.from(hex, 'hex')))
}

/**
 * Verifies if a string is a 256-bit hex number, case-agnostic.
 * @param {string} string
 * @returns string
 */
export function is256hex(string) {
  return string.match(/[A-Fa-f0-9]{64}/);
}

export function shortenEventId(id, length = 6) {
  return id.slice(0, length) + '...' + id.slice(-length);
}
