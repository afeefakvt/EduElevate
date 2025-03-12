import { Box, Grid, Card, CardContent, Typography, Toolbar } from '@mui/material';
import Navbar from './AdminNavbar';
import Sidebar from './Sidebar'; 
import { fetchDashboardCounts } from '@/api/adminApi'; 
import { useEffect, useState } from 'react';
import { fetchMostRatedCourse,featuredCourses } from '@/api/adminApi';
import category from '../../assets/category1.jpg'
import PieChart from './PieChart';

interface Course{
  title:string;
  thumbnail:string;
  categoryName:string
}

const AdminDashboard = () => {
  const navbarHeight = { xs: '64px', md: '80px' };
  const [counts,setCounts] = useState({courses:0,tutors:0,students:0})
  const [mostRatedCourse,setMostRatedCourse] = useState<Course | null>(null)
  const [featuredCourse,setfeaturedCourse] = useState<Course | null>(null)

  const metrics = [
    { title: 'Total Courses', value: counts.courses },
    { title: 'Total Tutors', value: counts.tutors },
    { title: 'Total Students', value: counts.students },
    { title: 'Total Revenue', value: '₹1,00,000' },
  ];

  const featured = [
    { title: 'Featured Course', name: featuredCourse?.title,thumbnail:featuredCourse?.thumbnail },
    { title: 'Featured Category', name: featuredCourse?.categoryName,thumbnail:category },
    { title: 'Most Rated Course', name: mostRatedCourse?.title,thumbnail:mostRatedCourse?.thumbnail },
  ];

  useEffect(()=>{
    const loadData = async()=>{
      const data = await fetchDashboardCounts()
      setCounts(data)

    const featuredCourse = await featuredCourses()    
    setfeaturedCourse(featuredCourse.courses[0])

    const mostRatedCourse = await fetchMostRatedCourse()
    setMostRatedCourse(mostRatedCourse) 
    }
    loadData()
  },[]);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <Box sx={{ display: 'flex', marginTop: navbarHeight }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 10 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}>
          Dashboard
        </Typography>

        {/* Metrics Section */}
        <Grid container spacing={3} mb={5}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' },
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {metric.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {metric.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Featured Cards Section */}
        <Grid container spacing={3} alignItems="stretch">
          {featured.map((item, index) => (
            <Grid item xs={12} sm={4} key={index} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3, flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      style={{
                        display: 'block',
                        margin: '0 auto',
                        width: '200px',
                        borderRadius: '8px',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                    />
                  )}
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold', color: '#555' }}>
                    {item.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* <PieChart/> */}
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

