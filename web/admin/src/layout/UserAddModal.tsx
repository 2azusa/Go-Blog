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

export interface INewUser {
  username: string;
  password?: string;
  email: string;
  role: number;
}

interface UserAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: INewUser) => void;
}

// 定义表单的初始状态
const initialUserState: INewUser = {
  username: '',
  password: '',
  email: '',
  role: 2, // 默认角色为“普通用户”
};

const UserAddModal = ({ open, onClose, onSave }: UserAddModalProps) => {
  const [newUser, setNewUser] = useState<INewUser>(initialUserState);

  // 当弹窗打开时，重置表单状态
  useEffect(() => {
    if (open) {
      setNewUser(initialUserState);
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };
  
  const handleRoleChange = (event: SelectChangeEvent<number>) => {
    const { value } = event.target;
    setNewUser({ ...newUser, role: Number(value) });
  };

  const handleSave = () => {
    // 可以在这里添加一些基础的前端校验
    if (!newUser.username || !newUser.password || !newUser.email) {
      alert('用户名、密码和邮箱不能为空！');
      return;
    }
    onSave(newUser);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>添加新用户</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="username"
          label="用户名"
          type="text"
          fullWidth
          variant="standard"
          value={newUser.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="password"
          label="密码"
          type="password"
          fullWidth
          variant="standard"
          value={newUser.password}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="邮箱"
          type="email"
          fullWidth
          variant="standard"
          value={newUser.email}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>角色</InputLabel>
          <Select
            name="role"
            value={newUser.role}
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

export default UserAddModal;