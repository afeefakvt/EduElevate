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


import logo from "../../assets/afeefalogo.png"
import { AppBar, Box,  Toolbar } from "@mui/material";

const AdminNavbar = () => {
   
    return (

        <AppBar
            position="fixed"
            elevation={2}
            sx={{
                borderBottom: "3px solid black",
                height: { xs: "64px", md: "80px" },
                padding: "8px",
                bgcolor: "white",
                zIndex: 1000,
                boxShadow:"none"

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
                            height: "300px",
                            width: "330px",
                            paddingLeft: "2rem",
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


