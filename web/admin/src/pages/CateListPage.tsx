import { useState, useEffect } from 'react';
import { categoryApi } from '../services/api';
import type { ICategory } from '../utils/types';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  // --- 步骤 1: 导入 Dialog 相关组件 ---
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import CateEditModal from '../layout/CateEditModal';
import type { ISaveCategoryData } from '../layout/CateEditModal';

const CateListPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  // --- 步骤 2: 添加管理删除确认框的状态 ---
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(null);

  // 获取所有分类
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getCategories();
      const result = response.data;
      if (result && result.status === 200) {
        setCategories(result.data || []);
      } else {
        setError(result.message || '获取分类列表失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '发生网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Modal Control Handlers ---
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: ICategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // --- 步骤 3: 更新删除流程 ---

  // 打开确认删除对话框
  const handleOpenConfirmDialog = (category: ICategory) => {
    setDeletingCategory(category);
    setIsConfirmOpen(true);
  };

  // 关闭确认删除对话框
  const handleCloseConfirmDialog = () => {
    setIsConfirmOpen(false);
    setDeletingCategory(null);
  };

  // 确认执行删除操作
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;

    setError(null);
    try {
      await categoryApi.deleteCategory(deletingCategory.id);
      fetchCategories(); // 删除成功后刷新列表
    } catch (err: any) {
      setError(err.response?.data?.message || '删除失败');
    } finally {
      handleCloseConfirmDialog(); // 无论成功失败，都关闭对话框
    }
  };


  // --- API Operation Handlers ---
  const handleSaveCategory = async (data: ISaveCategoryData) => {
    setError(null);
    try {
      if (data.id) {
        await categoryApi.editCategory(data.id, { name: data.name });
      } else {
        await categoryApi.addCategory({ name: data.name });
      }
      handleCloseModal();
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || '操作失败');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    }
    if (categories.length === 0) {
      return <Typography sx={{ mt: 2, textAlign: 'center' }}>暂无分类数据</Typography>;
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>分类名称</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenEditModal(category)}><EditIcon fontSize="small" /></IconButton>
                  {/* 步骤 4: 修改删除按钮的点击事件 */}
                  <IconButton size="small" onClick={() => handleOpenConfirmDialog(category)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1">
              分类管理
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddModal}>
              添加分类
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {renderContent()}
        </Paper>
      </Box>

      <CateEditModal
        open={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* 步骤 5: 添加 Dialog 组件到 JSX 中 */}
      <Dialog open={isConfirmOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            你确定要永久删除分类 "{deletingCategory?.name}" 吗？
            此操作不可撤销，该分类下的文章将变为“未分类”。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>取消</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CateListPage;