import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AdminNavbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
        ml: '240px',
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" sx={{ mr: 2 }}>
             Admin
          </Typography>
          <Avatar />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;