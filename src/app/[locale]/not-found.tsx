import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('404');

  return (
    <div className="container">
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      <Link href={`/`}>{t('button')}</Link>
    </div>
  );
}
