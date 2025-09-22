import { useState, useEffect } from 'react';
import axios from 'axios'; // 假设的 axios 实例

// 导入 MUI 组件
import {
  Card,
  CardMedia,
  Box,
  Avatar,
  Typography, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

// 导入 MUI 图标
import ChatIcon from '@mui/icons-material/Chat'; // MDI 'mdi-qqchat' 的替代品
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox'; // MDI 'mdi-wechat' 的替代品
import RssFeedIcon from '@mui/icons-material/RssFeed'; // MDI 'mdi-sina-weibo' 的替代品
import EmailIcon from '@mui/icons-material/Email'; // MDI 'mdi-email' 的替代品


// 1. 为 profileInfo 定义类型
interface ProfileInfo {
  id: number;
  name: string;
  desc: string;
  qq_chat: string;
  wechat: string;
  weibo: string;
  email: string;
  img: string;
  avatar: string;
}

// FIX 1: Renamed component from Nav to ProfileCard for consistency
const ProfileCard = () => {
  // 2. 使用 useState 管理状态
  // 初始值设为 null，以便在数据加载完成前显示加载状态或不显示
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);

  // 3. 使用 useEffect 获取数据
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: result } = await axios.get('api/profile');
        if (result.status === 200) {
          setProfileInfo(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile info:", error);
      }
    };
    getProfile();
  }, []); // 空依赖数组确保只在组件挂载时运行一次

  // 在数据返回前，可以显示一个加载提示或直接返回 null
  if (!profileInfo) {
    return <Card sx={{ maxWidth: 500, mx: 'auto' }}>Loading...</Card>;
  }

  // 4. 使用 JSX 和 MUI 组件进行渲染
  return (
    <Card sx={{ maxWidth: 500, mx: 'auto' }}>
      {/* 背景图部分，使用 Box 覆盖 CardMedia 来放置内容 */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160" // 自定义高度
          image={profileInfo.img}
          alt="Profile background"
        />
        {/* 覆盖在图片上的内容 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <Avatar
            src={profileInfo.avatar}
            sx={{ width: 90, height: 90, mb: 2 }} // mb: 2 对应 ma-4
          />
          <Typography variant="h6">{profileInfo.name}</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}> {/* p: 2 类似 padding */}
        <Typography variant="subtitle1">About Me:</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {profileInfo.desc}
        </Typography>
      </Box>

      <Divider />

      {/* FIX 2: Removed the "nav" prop, which is not valid on MUI's List component */}
      <List dense>
        <ListItem>
          <ListItemIcon>
            <ChatIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={profileInfo.qq_chat} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MarkunreadMailboxIcon color="success" />
          </ListItemIcon>
          <ListItemText primary={profileInfo.wechat} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RssFeedIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary={profileInfo.weibo} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EmailIcon sx={{ color: 'orange' }} />
          </ListItemIcon>
          <ListItemText primary={profileInfo.email} />
        </ListItem>
      </List>
    </Card>
  );
};

export default ProfileCard;