// src/components/Editor.tsx
import React from 'react';

// antd 表单要求自定义组件接收 value 和 onChange prop
interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.target.value);
  };

  return <textarea value={value} onChange={handleChange} style={{ width: '100%', minHeight: '300px' }} />;
};

export default Editor;