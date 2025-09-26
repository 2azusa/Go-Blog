// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useForm, Controller } from 'react-hook-form';
// import type { SubmitHandler } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { articlesApi, categoryApi } from '../services/api';
// import type { ICategory, IReqAddArticle, IReqUpdateArticle } from '../utils/types';
// import {
//   Box,
//   Typography,
//   Paper,
//   Alert,
//   CircularProgress,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormHelperText,
//   Grid,
// } from '@mui/material';

// // 表单数据验证规则
// const validationSchema = yup.object().shape({
//   title: yup.string().required('文章标题不能为空'),
//   cid: yup.number().min(1, '必须选择一个文章分类').required('必须选择一个文章分类'),
//   desc: yup.string().required('文章简介不能为空'),
//   content: yup.string().required('文章内容不能为空'),
//   // [FIX] Ensure the default value is null to match the interface and avoid 'undefined'
//   img: yup.string().url('请输入有效的图片URL').nullable().default(null),
// });

// // 表单数据接口
// interface IArticleFormData {
//   title: string;
//   cid: number;
//   desc: string;
//   content: string;
//   img: string | null;
// }

// const AddArticlePage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);

//   const [categories, setCategories] = useState<ICategory[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiError, setApiError] = useState<string | null>(null);

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<IArticleFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       title: '',
//       cid: 0,
//       desc: '',
//       content: '',
//       img: null,
//     },
//   });

//   // 获取分类列表，并在编辑模式下获取文章详情
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setApiError(null);
//       try {
//         // 1. 获取分类
//         const categoryRes = await categoryApi.getCategories();
//         const fetchedCategories = categoryRes.data.data || [];
//         if (categoryRes.data.status === 200) {
//           setCategories(fetchedCategories);
//         } else {
//           throw new Error('获取分类失败');
//         }

//         // 2. 如果是编辑模式，获取文章详情
//         if (isEditMode && id) {
//           const articleId = parseInt(id, 10);
//           const articleRes = await articlesApi.getArticleDetail(articleId);

//           if (articleRes.data.status === 200 && articleRes.data.data) {
//             const articleData = articleRes.data.data;
//             // 通过分类名反查分类ID
//             const category = fetchedCategories.find(cat => cat.name === articleData.name);
//             // 使用 reset 填充表单
//             reset({
//               title: articleData.title,
//               cid: category ? category.id : 0,
//               desc: articleData.desc,
//               content: articleData.content,
//               img: articleData.img || null, // 确保空字符串也转换为 null 以匹配类型
//             });
//           } else {
//             throw new Error(articleRes.data.message || '获取文章详情失败');
//           }
//         }
//       } catch (err: any) {
//         setApiError(err.response?.data?.message || err.message || '数据加载失败');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, isEditMode, reset]);


//   // 表单提交处理
//   const onSubmit: SubmitHandler<IArticleFormData> = async (formData) => {
//     setApiError(null);
//     // 准备提交给API的数据，确保 img 是 string 类型
//     const apiData = { ...formData, img: formData.img || '' };

//     try {
//       if (isEditMode && id) {
//         const articleId = parseInt(id, 10);
//         const postData: IReqUpdateArticle = { id: articleId, ...apiData };
//         await articlesApi.updateArticle(articleId, postData);
//       } else {
//         const postData: IReqAddArticle = apiData;
//         await articlesApi.addArticle(postData);
//       }
//       alert(isEditMode ? '文章更新成功！' : '文章发布成功！');
//       navigate('/articles'); // 成功后跳转到文章列表页
//     } catch (err: any) {
//       setApiError(err.response?.data?.message || '操作失败，请重试');
//     }
//   };
  
//   if (loading) {
//     return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Typography variant="h5" component="h1" gutterBottom>
//           {isEditMode ? '编辑文章' : '发布新文章'}
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
//           {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
//           <Grid container spacing={3}>
//             {/* [FIX] Add 'item' prop for responsive props like xs/md to work */}
//             <Grid item xs={12} md={8}>
//               <Controller
//                 name="title"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="文章标题"
//                     required
//                     fullWidth
//                     error={!!errors.title}
//                     helperText={errors.title?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             {/* [FIX] Add 'item' prop for responsive props like xs/md to work */}
//             <Grid item xs={12} md={4}>
//               <FormControl fullWidth required error={!!errors.cid}>
//                 <InputLabel>文章分类</InputLabel>
//                 <Controller
//                   name="cid"
//                   control={control}
//                   render={({ field }) => (
//                     <Select {...field} label="文章分类">
//                       <MenuItem value={0} disabled><em>请选择分类</em></MenuItem>
//                       {categories.map((cat) => (
//                         <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
//                       ))}
//                     </Select>
//                   )}
//                 />
//                 <FormHelperText>{errors.cid?.message}</FormHelperText>
//               </FormControl>
//             </Grid>
//             {/* [FIX] Add 'item' prop for responsive props like xs/md to work */}
//             <Grid item xs={12}>
//               <Controller
//                 name="desc"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="文章简介"
//                     required
//                     fullWidth
//                     multiline
//                     rows={3}
//                     error={!!errors.desc}
//                     helperText={errors.desc?.message}
//                   />
//                 )}
//               />
//             </Grid>
//             {/* [FIX] Add 'item' prop for responsive props like xs/md to work */}
//             <Grid item xs={12}>
//                 <Controller
//                     name="img"
//                     control={control}
//                     render={({ field }) => (
//                         <TextField
//                             {...field}
//                             label="封面图片URL (可选)"
//                             fullWidth
//                             // 当值为 null 时，确保 TextField 显示为空字符串
//                             value={field.value || ''}
//                             error={!!errors.img}
//                             helperText={errors.img?.message}
//                         />
//                     )}
//                 />
//             </Grid>
//             {/* [FIX] Add 'item' prop for responsive props like xs/md to work */}
//             <Grid item xs={12}>
//               <Controller
//                 name="content"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="文章内容"
//                     required
//                     fullWidth
//                     multiline
//                     rows={15}
//                     error={!!errors.content}
//                     helperText={errors.content?.message}
//                   />
//                 )}
//               />
//             </Grid>
//           </Grid>

//           <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//             <Button variant="outlined" color="inherit" onClick={() => navigate(-1)}>
//               取消
//             </Button>
//             <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
//               {isSubmitting ? '提交中...' : (isEditMode ? '确认更新' : '立即发布')}
//             </Button>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default AddArticlePage;