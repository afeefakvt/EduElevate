import logo from "../../assets/afeefalogo.png"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState, store } from "../../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from "react";
import { logout } from "../../store/authSlice";
import { ModeToggle } from "../ui/modeToggle";

const Navbar = () => {

    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.auth.token)
    const student = useSelector((state: RootState) => state.auth.student)

    const dispatch = useDispatch()
    useEffect(() => {
        console.log("Current Redux state:", store.getState());
    }, [])

    const handleLogout = () => {
        try {
            dispatch(logout())
            console.log('logged out');
            navigate('/login')

        } catch (error) {
            console.log(error);


        }
    }
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
                    onClick={() => navigate("/")}

                    style={
                        {
                            height: "300px",
                            width: "330px",
                            paddingLeft: "1rem",
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
                    {token ? (
                        <Box display={"flex"} justifyContent="center" alignItems="center">
                            <Button
                                variant="contained" color="primary"
                                sx={{ color: "white", margin: 0, backgroundColor: "#550A8A" }}
                                onClick={() => navigate("/profile")}
                            >
                                Profile
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    backgroundColor: "#550A8A",
                                    display: { xs: "none", sm: 'block' },
                                    //   "&:hover": { backgroundColor: "#333" },
                                }}
                                onClick={() => handleLogout()}
                            >
                                Logout
                            </Button>
                        </Box>

                    ) : (
                        <Box display={"flex"} justifyContent="center" alignItems="center">
                            <Button
                                variant="contained" color="primary"
                                sx={{ color: "white", margin: 0, backgroundColor: "#550A8A" }}
                                onClick={() => navigate("/login")}
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


                    )}
                </Box>

            </Toolbar>
        </AppBar>

    )
}

export default Navbar
