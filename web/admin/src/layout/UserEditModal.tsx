import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';
import type { IUser } from '../utils/types';

interface UserEditModalProps {
  open: boolean;
  user: IUser | null;
  onClose: () => void;
  onSave: (user: IUser) => void;
}

const UserEditModal = ({ open, user, onClose, onSave }: UserEditModalProps) => {
  // 状态现在也使用导入的 IUser 类型
  const [editedUser, setEditedUser] = useState<IUser | null>(user);

  // 当外部传入的 user prop 变化时，同步更新内部状态
  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  // 处理文本输入框的变化
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (editedUser) {
      setEditedUser({ ...editedUser, [name]: value });
    }
  };

  // 处理角色选择器的变化
  // 注意：这里的类型注解现在是正确的了
  const handleRoleChange = (event: SelectChangeEvent<number>) => {
    const { value } = event.target;
    if (editedUser) {
      // 确保值是数字类型
      setEditedUser({ ...editedUser, role: Number(value) });
    }
  };

  // 点击保存按钮
  const handleSave = () => {
    if (editedUser) {
      onSave(editedUser); // 通过回调函数将修改后的用户数据传回父组件
    }
  };

  if (!editedUser) return null; // 如果没有用户数据，不渲染任何内容

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>编辑用户信息</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus // 自动聚焦
          margin="dense"
          name="username"
          label="用户名"
          type="text"
          fullWidth
          variant="standard"
          value={editedUser.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="邮箱"
          type="email"
          fullWidth
          variant="standard"
          value={editedUser.email || ''}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>角色</InputLabel>
          <Select
            name="role"
            value={editedUser.role}
            onChange={handleRoleChange}
          >
            <MenuItem value={1}>管理员</MenuItem>
            <MenuItem value={2}>普通用户</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained">保存</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditModal;