import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700], // 类似于 'blue darken-2'
    },
    secondary: {
      main: '#f50057', // 类似于 'pink'
    },
    // ... 你可以在这里定义更多颜色、字体、间距等
  },
});

export default theme;