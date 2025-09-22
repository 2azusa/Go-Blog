import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    // 1. 使用 Box 组件并指定其为 'footer' 标签，符合 HTML5 语义化
    <Box
      component="footer"
      sx={{
        // 2. 使用 sx 属性转换样式
        backgroundColor: 'primary.dark', // 对应 'blue darken-2'
        color: 'white',                  // 对应 'white--text'
        textAlign: 'center',             // 对应 'text-center'
        py: 2,                           // 对应 padless，但我们添加了 2 个单位的垂直内边距 (padding-top/bottom) 以便美观
      }}
    >
      {/* 3. 使用 Typography 组件来承载文本，并转换内容 */}
      <Typography variant="body2">
        {new Date().getFullYear()} - MyBlog
      </Typography>
    </Box>
  );
};

export default Footer;