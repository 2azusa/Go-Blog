import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import type { ICategory } from '../utils/types';

// 定义 onSave 回调函数接收的数据类型
export interface ISaveCategoryData {
  id?: number; // 编辑时有id
  name: string;
}

interface CateEditModalProps {
  open: boolean;
  category: ICategory | null; // null 表示添加模式, ICategory 对象表示编辑模式
  onClose: () => void;
  onSave: (data: ISaveCategoryData) => void;
}

const CateEditModal = ({ open, category, onClose, onSave }: CateEditModalProps) => {
  const [name, setName] = useState('');

  // 当外部传入的 category prop 变化时，同步更新表单内的 name
  useEffect(() => {
    // 如果 category 存在 (编辑模式)，则填充 name；否则 (添加模式)，设置为空字符串
    setName(category?.name || '');
  }, [category, open]); // 依赖 open 确保每次打开弹窗时都重新同步状态

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        id: category?.id, // 如果是编辑模式，则传递 id
        name: name,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{category ? '编辑分类' : '添加分类'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="分类名称"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained">保存</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CateEditModal;