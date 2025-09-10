import { useState } from 'react';
import styles from './tabs.module.scss';

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultActive?: string;
};

export function Tabs({ tabs, defaultActive }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActive ?? tabs[0].label
  );

  return (
    <div className={styles.container}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`${styles.tab} ${activeTab === tab.label ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {tabs.find((t) => t.label === activeTab)?.content}
      </div>
    </div>
  );
}
