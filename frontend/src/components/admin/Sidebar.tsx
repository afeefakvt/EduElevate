import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', path: '/admin/home' },
    { text: 'Students', path: '/admin/students' },
    { text: 'Tutors', path: '/admin/tutors' },
    { text: 'Category', path: '/admin/categories' },
    { text: 'Courses', path: '/admin/courses' },
    { text: 'Course Applications', path: '/admin/courseApplications' },
    { text: 'Payment Management', path: '/admin/payments' },
    { text: 'Logout', path: '/admin/logout' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' ,marginTop:{xs:'64px',md:'80px'}},
      }}
    >
      <Toolbar  />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            component={NavLink}
            to={item.path}
            key={item.text}
            sx={{
              '&.active': { backgroundColor: 'rgba(0, 0, 255, 0.1)' },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

