/*import { useTranslations } from 'next-intl';*/
import CodePanel from '../../code-panel/code-panel';
import styles from './response-viewer.module.scss';

export default function ResponseViewer() {
  /* const t = useTranslations('RestClient');*/

  const text = ``;

  return (
    <div className={styles.wrapper}>
      <CodePanel initText={text} title="body" isReadOnly />
    </div>
  );
}
