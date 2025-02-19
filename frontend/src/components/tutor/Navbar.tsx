import logo from "../../assets/afeefalogo.png"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState, store,persistor } from "../../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from "react";
import { tutorLogout } from "../../store/tutorAuthSlice";
import { logoutTutor } from "@/api/tutorApi";
import Cookies from "js-cookie";

const Navbar = () => {

    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.tutorAuth.token)
    const tutor = useSelector((state: RootState) => state.tutorAuth.tutor)

    const dispatch = useDispatch()
    useEffect(() => {
        console.log("Current Redux state:", store.getState());
    }, [])

    const handleLogout = async() => {
        try {
            console.log("Before logout:", Cookies.get("tutorAuthToken")); 

            dispatch(tutorLogout())
            await persistor.flush();
            await persistor.purge();
            console.log("Tutor logged out successfully");
            console.log("After logout:", Cookies.get("tutorAuthToken"));

            await logoutTutor()
            localStorage.setItem("logoutSuccess","true")  //Store logout success message in local storage

            navigate('/tutor/login')

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
                    // onClick={() => navigate("/tutor/")}

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
                       My Courses
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
                        Add a course
                    </Typography>
                    {token ? (
                        <Box display={"flex"} justifyContent="center" alignItems="center">
                            <Button
                                variant="contained" color="primary"
                                sx={{ color: "white", margin: 0, backgroundColor: "#550A8A" }}
                                onClick={() => navigate("/tutor/profile")}
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
                                onClick={() => navigate("/tutor/login")}
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
                                onClick={() => navigate("/tutor/register")}
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
