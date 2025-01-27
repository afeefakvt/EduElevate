// import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

// const AdminNavbar = () => {
//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         width: `calc(100% - 240px)`,
//         ml: '240px',
//       }}
//     >
//       <Toolbar>
//         <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
//           <MenuIcon />
//         </IconButton>
//         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//           Dashboard
//         </Typography>
//         <Box display="flex" alignItems="center">
//           <Typography variant="body1" sx={{ mr: 2 }}>
//              Admin
//           </Typography>
//           <Avatar />
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default AdminNavbar;


import logo from "../../assets/Eduelevate.png"
import { AppBar, Box,  Toolbar, Typography } from "@mui/material";

const AdminNavbar = () => {
   
    return (

        <AppBar
            position="fixed"
            elevation={2}
            sx={{
                borderBottom: "1px solid #e0e0e0",
                height: { xs: "64px", md: "80px" },
                padding: "8px",
                bgcolor: "white",
                zIndex: 1000,

            }}
        >

            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                    //   display="flex"
                    //   alignItems="center"
                    component={"img"}
                    src={logo}
                    alt="Logo"
                    // onClick={() => navigate("/admin/home")}

                    style={
                        {
                            height: "79px",
                            width: "100px",
                            paddingLeft: "3rem",
                            marginRight: "8px",
                        }
                    }
                    sx={{
                        height: { xs: "20px", md: "26px" },
                        width: { xs: "100px", md: "120px" },
                        paddingLeft: { xs: "0rem", md: "3rem" },
                        cursor: "pointer"
                    }}
                ></Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                        variant="body2"
                        color="black"
                        sx={{
                            cursor: "pointer",
                            fontWeight: 750,
                            display: { xs: "none", md: "block" },
                        }}
                    >
                        Admin
                    </Typography>
                        <Box display={"flex"} justifyContent="center" alignItems="center">
                           
                        </Box>
                        <Box display={"flex"} justifyContent="center" alignItems="center">
                          
                        </Box>
                </Box>

            </Toolbar>
        </AppBar>

    )
}

export default AdminNavbar


