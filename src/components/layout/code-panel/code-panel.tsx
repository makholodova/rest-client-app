import style from './code-panel.module.scss';
import { useEffect, useState } from 'react';
import CodePanelHeader from './code-panel-header';

type CodePanelProps = {
  code: string[];
};

export default function CodePanel({ code }: CodePanelProps) {
  const [editedCode, setEditedCode] = useState<string[]>(code);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setEditedCode(code);
  }, [code]);

  const updateLine = (index: number, newValue: string) => {
    setEditedCode((prev) => {
      const newCode = [...prev];
      newCode[index] = newValue;
      return newCode;
    });
  };

  return (
    <section className={style.panel}>
      <CodePanelHeader {...{ editedCode, setEditedCode, isEdit, setIsEdit }} />

      {isEdit ? (
        <form className={style.editing}>
          {editedCode.map((str, index) => (
            <label key={index}>
              <p>{index + 1}</p>
              <input
                type="text"
                defaultValue={str}
                onChange={(e) => updateLine(index, e.target.value)}
              />
            </label>
          ))}
        </form>
      ) : (
        <pre className={style.pre}>
          <ol>
            {editedCode.map((str, index) => (
              <li key={`pre ${index}`}>{str}</li>
            ))}
          </ol>
        </pre>
      )}
    </section>
  );
}
