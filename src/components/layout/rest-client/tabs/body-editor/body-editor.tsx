/*import { useTranslations } from 'next-intl';*/
import styles from './body-editor.module.scss';
import CodePanel from '@/components/layout/code-panel/code-panel';

export default function BodyEditor() {
  /*const t = useTranslations('RestClient');*/
  const text = `test \n test \n test`;

  return (
    <div className={styles.wrapper}>
      <CodePanel initText={text} title="body" />
    </div>
  );
}
