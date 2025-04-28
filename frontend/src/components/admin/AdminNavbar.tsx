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


