import { Box, Toolbar } from '@mui/material';
import Navbar from './AdminNavbar';
import Sidebar from './Sidebar';


const AdminDashboard = () => {
  const navbarHeight = { xs: '64px', md: '80px' };
 
  return (
    
    <Box sx={{ display: 'flex',flexDirection:'column' }}>
      
     <Navbar/>
     <Box sx={{ display: 'flex', marginTop: navbarHeight }}>
        <Sidebar />
      <Toolbar />

      <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar /> {/* Optional spacing */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <h4>Admin Dashboard</h4>
      </Box>
    </Box>
  </Box>
  </Box>
  );
};

export default AdminDashboard;






// import React from "react";
// import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
// import { Box, Typography, List, ListItemButton, ListItemText } from "@mui/material";
// import Students from "./Students"; // Import the Students component

// // Sidebar navigation links
// const navLinks = [
//   { path: "/admin/home", title: "Home" },
//   { path: "/admin/students", title: "Students" },
//   { path: "/admin/tutors", title: "Tutors" },
//   { path: "/admin/courses", title: "Courses" },
//   { path: "/admin/about", title: "About Us" },
// ];

// const AdminDashboard = () => {
//   return (
//     <Router>
//       <Box sx={{ display: "flex", height: "100vh" }}>
//         {/* Sidebar */}
//         <Box
//           sx={{
//             width: 240,
//             backgroundColor: "#f5f5f5",
//             borderRight: "1px solid #ddd",
//             display: "flex",
//             flexDirection: "column",
//             p: 2,
//           }}
//         >
//           <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
//             Admin Panel
//           </Typography>
//           <List>
//             {navLinks.map((link) => (
//               <NavLink
//                 to={link.path}
//                 key={link.path}
//                 style={({ isActive }) => ({
//                   textDecoration: "none",
//                   color: isActive ? "white" : "black",
//                 })}
//               >
//                 <ListItemButton
//                   sx={{
//                     backgroundColor: ({ isActive }) =>
//                       isActive ? "#1976d2" : "transparent",
//                     borderRadius: 1,
//                     "&:hover": {
//                       backgroundColor: "#e0e0e0",
//                     },
//                   }}
//                 >
//                   <ListItemText
//                     primary={link.title}
//                     sx={{
//                       color: ({ isActive }) => (isActive ? "white" : "inherit"),
//                     }}
//                   />
//                 </ListItemButton>
//               </NavLink>
//             ))}
//           </List>
//         </Box>

//         {/* Content Area */}
//         <Box sx={{ flex: 1, p: 3 }}>
//           <Routes>
//             <Route path="/admin/home" element={<Typography variant="h4">Welcome to the Admin Panel</Typography>} />
//             <Route path="/admin/students" element={<Students />} />
//             <Route path="/admin/tutors" element={<Typography variant="h4">Tutors Page</Typography>} />
//             <Route path="/admin/courses" element={<Typography variant="h4">Courses Page</Typography>} />
//             <Route path="/admin/about" element={<Typography variant="h4">About Us Page</Typography>} />
//           </Routes>
//         </Box>
//       </Box>
//     </Router>
//   );
// };

// export default AdminDashboard;

// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import { createTheme } from '@mui/material/styles';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';

// // Import components for nested routing
// import Students from './Students';

// const NAVIGATION: Navigation = [
//   {
//     segment: 'home',
//     title: 'Home',
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: 'students',
//     title: 'Students',
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: 'tutors',
//     title: 'Tutors',
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: 'orders',
//     title: 'Orders',
//     icon: <DashboardIcon />,
//   },
// ];

// const demoTheme = createTheme({
//   cssVariables: {
//     colorSchemeSelector: 'data-toolpad-color-scheme',
//   },
//   colorSchemes: { light: true, dark: true },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });

// function HomePage() {
//   return (
//     <Box
//       sx={{
//         py: 4,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         textAlign: 'center',
//       }}
//     >
//       <Typography variant="h4">Welcome to the Admin Dashboard
        
//       </Typography>
//     </Box>
//   );
// }

// export default function AdminDashboard() {
//   return (
//     <AppProvider
//       navigation={NAVIGATION}
//       branding={{
//                 // logo: <img src={login}  />,  
//         title: 'EDUELEVATE',
//         homeUrl: '/admin/home',
//       }}
//       theme={demoTheme}
//     >
//       <DashboardLayout>
//         <Routes>
//           <Route path="/admin/home" element={<HomePage />} />
//           <Route path="/admin/students" element={<Students />} />
//           {/* Add more routes as needed */}
//         </Routes>
//       </DashboardLayout>
//     </AppProvider>
//   );
// }

