import { DateTime } from "luxon";

export function timeAgo(d) {
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


export function getEventTime(timestamp) {
  const date = DateTime.fromSeconds(timestamp);
  const createdAt = `${date.toISODate()} ${date.toLocaleString(DateTime.TIME_24_SIMPLE)}`;
  const relativeTime = timeAgo(date);

  return [createdAt, relativeTime];
}
