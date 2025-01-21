import logo from "../../assets/Eduelevate.png"
import { AppBar, Avatar, Box, Button, IconButton, InputAdornment, Menu, MenuItem, TextField, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import SearchIcon from "@mui/icons-material/Search";


const Navbar = () => {

    const navigate  = useNavigate()
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
                    //   onClick={() =>navigate("/home")}

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
                {/* <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          sx={{
            borderRadius: "24px",
            backgroundColor: "#f9f9f9",
            width: "50%",
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "24px",
            },
            "& .MuiInputBase-input::placeholder": {
              fontSize: { xs: "small", md: "medium" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ height: { xs: "15px", md: "40px" } }} />
              </InputAdornment>
            ),
          }}
        /> */}
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
                        Home
                    </Typography>
                    <Typography
                        variant="body2"
                        color="black"
                        sx={{
                            cursor: "pointer",
                            fontWeight: 750,
                            display: { xs: "none", md: "block" },
                        }}
                    >
                        Courses
                    </Typography>
                    <Typography
                        variant="body2"
                        color="black"
                        sx={{
                            cursor: "pointer",
                            fontWeight: 750,
                            display: { xs: "none", md: "block" },
                        }}
                    >
                        My Courses
                    </Typography>
                    <Box display={"flex"} justifyContent="center" alignItems="center">
                        <Button
                            variant="contained" color="primary"
                            sx={{ color: "white", margin: 0, backgroundColor: "#550A8A" }}
                        // onClick={() => navigate("/login")}
                        >
                            Log in
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                backgroundColor: "#550A8A",
                                display: { xs: "none", sm: 'block' },
                                //   "&:hover": { backgroundColor: "#333" },
                            }}
                        onClick={() => navigate("/register")}
                        >
                            Sign up
                        </Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>

    )
}

export default Navbar
