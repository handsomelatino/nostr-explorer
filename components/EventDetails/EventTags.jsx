import Link from 'next/link';
import { is256hex } from '../../utils/nostr';
import IconLink from '../layout/IconLink/IconLink';
import styles from './EventTags.module.scss';

export default function EventTags({ event }) {
  let { tags } = event;

  // for contact list,, filter out p tags as they are already shown in <Content />
  if (event.kind === 3) {
    tags = tags.filter(tag => tag[0] !== 'p')
  }

  if (tags.length === 0) {
    return (
      <div className={styles.noTags}>No tags to show</div>
    );
  }

  const maxCols = tags.reduce((max, t) => (t.length > max ? t.length : max), 0);

  const renderItem = (tag, item) => {
    const type = tag[0];

    const renderItem = is256hex(item) ? <pre>{ item }</pre> : item;
    
    const renderLink = <IconLink href={`/${type}/${item}`} />;
    const showLink = is256hex(item) && ['e', 'p'].includes(type) ? renderLink : null;

    return (
      <div>{ renderItem } { showLink}</div>
    )
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Type</th>
          <th colSpan={maxCols}>Value</th>
        </tr>
      </thead>
      <tbody>
        { tags.map((tag, rowIndex) => (
          <tr key={rowIndex}>
            { tag.map((item, colIndex) => (
              <td key={colIndex} colSpan={colIndex === tag.length - 1 && colIndex + 1 < maxCols ? maxCols - colIndex : 1}>
                { renderItem(tag, item) }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
