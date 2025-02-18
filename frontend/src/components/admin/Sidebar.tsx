import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  IconButton,
  Divider,
  Box,
  useMediaQuery,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Category as CategoryIcon,
  MenuBook as CoursesIcon,
  Assignment as ApplicationsIcon,
  Payment as PaymentIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";

const menuItems = [
  { text: "Dashboard", path: "/admin/home", icon: <DashboardIcon /> },
  { text: "Students", path: "/admin/students", icon: <PeopleIcon /> },
  { text: "Tutors", path: "/admin/tutors", icon: <SchoolIcon /> },
  { text: "Category", path: "/admin/categories", icon: <CategoryIcon /> },
  { text: "Courses", path: "/admin/courses", icon: <CoursesIcon /> },
  { text: "Course Applications", path: "/admin/courseApplications", icon: <ApplicationsIcon /> },
  { text: "Edit Applications", path: "/admin/editApplications", icon: <ApplicationsIcon /> },
  { text: "Payment Management", path: "/admin/payments", icon: <PaymentIcon /> },
  { text: "Logout", path: "/admin/logout", icon: <LogoutIcon /> },
];

const Sidebar = () => {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const [open, setOpen] = useState(!isMobile);
    const dispatch = useDispatch()
    const navigate = useNavigate()


  const toggleDrawer = () => {
    setOpen(!open);
  };


  const handleLogout = ()=>{
    dispatch(logout())
    navigate('/admin/login')
  }
  return (
    <>
      {/* Menu button for small screens */}
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 1300,
            background: "white",
            borderRadius: "50%",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: open ? 300 : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            marginTop: "82px", // Matches Navbar height
            height: "calc(100vh - 64px)", // Prevents covering Navbar
            backgroundColor: "white",
            boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
            borderRight: "1.5px solid #ddd",
            position:"fixed"
          },
        }}
      >
        <Divider />

        <List sx={{ paddingY: 3 }}>
          {menuItems.map((item) => (
           item.text === "Logout" ? (
            <ListItemButton
              key={item.text}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: "12px 20px",
                borderRadius: "6px",
                margin: "6px",
                color: "#333",
                "&:hover": {
                  backgroundColor: "light-grey",
                  transition: "0.3s",
                },
              }}
              onClick={handleLogout} // Call handleLogout when clicked
            >
              <ListItemIcon sx={{ minWidth: 40, color: "black" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ) : (
            <ListItemButton
              component={NavLink}
              to={item.path}
              key={item.text}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: "12px 20px",
                borderRadius: "6px",
                margin: "6px",
                color: "#333",
                "&.active": {
                  backgroundColor: "black",
                  fontWeight: "bold",
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: "light-grey",
                  transition: "0.3s",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "black" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          )
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;



// import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"; // Ensure correct import path
// import { Link } from "react-router-dom";
// import { Home as HomeIcon, People as PeopleIcon, School as SchoolIcon, Category as CategoryIcon } from "@mui/icons-material";

// const AdminSidebar = () => {
//   return (
//     <SidebarProvider> {/* Wrap Sidebar inside SidebarProvider */}
//       <Sidebar className="w-60 h-screen bg-white shadow-md">
//         <div className="flex flex-col space-y-2 p-4">
//           {/* Sidebar item: Dashboard */}
//           <Link to="/admin/home" className="flex items-center p-2 text-lg text-gray-800 hover:bg-gray-200 rounded-md">
//             <HomeIcon className="mr-2" />
//             Dashboard
//           </Link>

//           {/* Sidebar item: Students */}
//           <Link to="/admin/students" className="flex items-center p-2 text-lg text-gray-800 hover:bg-gray-200 rounded-md">
//             <PeopleIcon className="mr-2" />
//             Students
//           </Link>

//           {/* Sidebar item: Tutors */}
//           <Link to="/admin/tutors" className="flex items-center p-2 text-lg text-gray-800 hover:bg-gray-200 rounded-md">
//             <SchoolIcon className="mr-2" />
//             Tutors
//           </Link>

//           {/* Sidebar item: Categories */}
//           <Link to="/admin/categories" className="flex items-center p-2 text-lg text-gray-800 hover:bg-gray-200 rounded-md">
//             <CategoryIcon className="mr-2" />
//             Categories
//           </Link>
//         </div>
//       </Sidebar>
//     </SidebarProvider>
//   );
// };

// export default AdminSidebar;


