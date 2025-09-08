import Button from '@/components/ui/button/button';
import style from './code-panel.module.scss';
import { toast } from 'react-toastify';
import { useRef } from 'react';

type CodePanelHeaderProps = {
  editedCode: string[];
  setEditedCode: (str: string[]) => void;
  isEdit: boolean;
  setIsEdit: (b: boolean) => void;
};

export default function CodePanelHeader({
  editedCode,
  setEditedCode,
  isEdit,
  setIsEdit,
}: CodePanelHeaderProps) {
  const bufferCode = useRef<string[]>([]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedCode.join('\n'));
      toast.success('Текст скопирован в буфер обмена');
    } catch (err) {
      toast.error(`Ошибка копирования: ${err}`);
    }
  };

  const startEdit = () => {
    bufferCode.current = editedCode;
    setIsEdit(true);
  };

  const saveChanges = () => {
    toast.success('Код успешно обновлён');
    setIsEdit(false);

    bufferCode.current = [];
  };

  const cancelEdit = () => {
    setEditedCode(bufferCode.current);
    setIsEdit(false);
  };

  return (
    <header className={style.header}>
      <h2 className={style.title}>javascript/fetch</h2>

      <Button>generate code</Button>

      <div className={style.tools}>
        <Button onClick={copyToClipboard}>copy</Button>
        {isEdit ? (
          <>
            <Button onClick={saveChanges}>save</Button>
            <Button onClick={cancelEdit}>cancel</Button>
          </>
        ) : (
          <Button onClick={startEdit}>edit</Button>
        )}
      </div>
    </header>
  );
}
