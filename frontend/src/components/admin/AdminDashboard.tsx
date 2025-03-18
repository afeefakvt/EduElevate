import { Box, Grid, Card, CardContent, Typography, Toolbar,TextField,MenuItem,Select } from '@mui/material';
import Navbar from './AdminNavbar';
import Sidebar from './Sidebar'; 
import { fetchDashboardCounts } from '@/api/adminApi'; 
import { useEffect, useState } from 'react';
import { fetchMostRatedCourse,featuredCourses } from '@/api/adminApi';
import category from '../../assets/category1.jpg'
import { Course } from '@/interfaces/interface';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fillMissingDates } from '@/utils/dateHandler';
import { getSalesReport } from '@/api/enrollmentApi';
import { fetchTotalRevenue } from '@/api/adminApi';
// import PieChart from './PieChart';


const AdminDashboard = () => {
  const navbarHeight = { xs: '64px', md: '80px' };
  const [counts,setCounts] = useState({courses:0,tutors:0,students:0})
  const [mostRatedCourse,setMostRatedCourse] = useState<Course | null>(null)
  const [featuredCourse,setfeaturedCourse] = useState<Course | null>(null)
  const [timeRange,setTimeRange] = useState<"daily" | "monthly" | "yearly" | "custom">("daily")
  const [customDates,setCustomDates] = useState({startDate:"",endDate:""})
  const [salesData,setSalesData] = useState<{date:string,totalRevenue:number}[]>([])
  const [totalAmount,setTotalAmount] = useState(0)


  

  const metrics = [
    { title: 'Total Courses', value: counts.courses },
    { title: 'Total Tutors', value: counts.tutors },
    { title: 'Total Students', value: counts.students },
    { title: 'Total Revenue', value: totalAmount },
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

      const total  = await fetchTotalRevenue()
      setTotalAmount(total)

    const featuredCourse = await featuredCourses()    
    setfeaturedCourse(featuredCourse.courses[0])

    const mostRatedCourse = await fetchMostRatedCourse()
    setMostRatedCourse(mostRatedCourse) 
    }
    loadData()
  },[]);
 
  useEffect(()=>{
    
    if(timeRange==="custom" && (!customDates.startDate || !customDates.endDate)) return;
    const debounceFetch = setTimeout(fetchsalesReport, 500);

    return () => clearTimeout(debounceFetch);

  },[timeRange,customDates])

  const fetchsalesReport = async()=>{
    try {
      // console.log("slaeeee");
      
      const data = await getSalesReport(timeRange,customDates.startDate,customDates.endDate)
      console.log(data);
      
      const formattedData = fillMissingDates(data,timeRange, new Date(customDates.startDate),new Date(customDates.endDate))
      console.log(formattedData);
      
      setSalesData(formattedData)
    } catch (error) {
      console.error("Error fetching sales report", error);
    }

  }

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
                {metric.title === 'Total Revenue' ? `₹${metric.value}` : metric.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ flex: 2, p: 2, bgcolor: "#FAFAFA", mb:10 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              variant="h6"
              fontWeight={"bold"}
              sx={{ fontSize: { xs: 16, md: 20 } }}
            >
              Sales Report
            </Typography>
          
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              height: "30px",
              mb: 4,
              mt: 2,
              gap: 2,
            }}
          >
            <Select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(
                  e.target.value as
                    | "daily"
                    | "monthly"
                    | "yearly"
                    | "custom"
                )
              }
              size="small"
              sx={{ fontSize: { xs: 12, md: 16 } }}
            >
              <MenuItem value="daily" sx={{ fontSize: { xs: 12, md: 16 } }}>
                Daily
              </MenuItem>
              <MenuItem value="monthly" sx={{ fontSize: { xs: 12, md: 16 } }}>
                Monthly
              </MenuItem>
              <MenuItem value="yearly" sx={{ fontSize: { xs: 12, md: 16 } }}>
                Yearly
              </MenuItem>
              {/* <MenuItem value="custom" sx={{ fontSize: { xs: 12, md: 16 } }}>
                Custom
              </MenuItem> */}
            </Select>

            {timeRange === "custom" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1,
                  alignItems: { xs: "stretch", sm: "center" },
                  width: "100%",
                  mt: { xs: -4, md: 0 },
                }}
              >
                <TextField
                  type="date"
                  label="Start Date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ fontSize: { xs: 12, md: 14 } }}
                  onChange={(e) =>
                    setCustomDates({
                      ...customDates,
                      startDate: e.target.value,
                    })
                  }
                />
                <TextField
                  type="date"
                  label="End Date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ fontSize: { xs: 12, md: 14 } }}
                  onChange={(e) =>
                    setCustomDates({ ...customDates, endDate: e.target.value })
                  }
                />
              </Box>
            )}
          </Box>
          <Box sx={{ width: "100%", height: { xs: 200, md: 300 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={0}
                  tickFormatter={(date) => {
                    const dateObj = new Date(date);
                    if (timeRange === "daily") {
                      return String(dateObj.getDate());
                    } else if (timeRange === "monthly") {
                      return String(dateObj.getMonth() + 1);
                    } else if (timeRange === "yearly") {
                      return String(dateObj.getFullYear());
                    }
                    return dateObj.toLocaleDateString();
                  }}
                />
                <YAxis />
                {/* <Tooltip /> */}
                <Bar dataKey="totalRevenue" fill="#107dac" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

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

