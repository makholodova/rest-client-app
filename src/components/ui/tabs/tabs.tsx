import { useState } from 'react';
import s from './tabs.module.scss';

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultActive?: string;
};

export const Tabs = ({ tabs, defaultActive }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActive ?? tabs[0].label
  );

  return (
    <div className={s.container}>
      <div className={s.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`${s.tab} ${activeTab === tab.label ? s.active : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={s.tabContent}>
        {tabs.find((t) => t.label === activeTab)?.content}
      </div>
    </div>
  );
};
