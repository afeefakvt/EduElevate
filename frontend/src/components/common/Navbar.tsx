import logo from "../../assets/logoaf.png"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Avatar, IconButton, Menu, MenuItem,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { persistor, RootState, store } from "../../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect,useState } from "react";
import { logout } from "../../store/authSlice";
import { logoutStudent } from "@/api/authApi";
import Cookies from "js-cookie";
import storage from 'redux-persist/lib/storage';



const Navbar = () => {

    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.auth.token)
    const student = useSelector((state: RootState) => state.auth.student)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        console.log("Current Redux state:", store.getState());
    }, [])

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogoutClick = () => {
        setDialogOpen(true);
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };  

    const handleConfirmLogout = async () => {
        try {
            console.log("Before logout:", Cookies.get("authToken")); 

            dispatch(logout()); //remove the user data from redux store
            await persistor.flush(); //ensure persisted state is updated
            storage.removeItem('persist:auth');//clear persisted redux state
            console.log("student logged out successfully");
            console.log("After logout:", Cookies.get("authToken"));
             -
            await logoutStudent()
            localStorage.setItem("logoutSuccess","true")  //Store logout success message in local storage
            if(student?.role==="student"){
                navigate('/login')
            }else if(student?.role==="admin"){
                navigate('/admin/login')
            }

        } catch (error) {
            console.log(error);
        }finally{
            setDialogOpen(false)
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
                            px:2
                        }}
                        onClick={() => navigate("/")} 
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
                            px:2
                        }}
                        onClick={() => navigate("/courses")}

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
                            px:2
                        }}
                        onClick={() => navigate("/myCourses")}

                    >
                        My Courses
                    </Typography>
                    {token ? (
                        <>
                        {/* Avatar Button */}
                        <IconButton onClick={handleMenuOpen}>
                            <Avatar 
                                // src={student?.profilePic || ""} 
                                alt={student?.name}
                                sx={{ width: 40, height: 40, bgcolor: "#550A8A", color: "white", fontSize: 18 }}
                            >
                                {student?.name?.charAt(0).toUpperCase()} {/* First letter if no image */}
                            </Avatar>
                        </IconButton>
    
                        {/* Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => { navigate("/messages"); handleMenuClose(); }}>
                                Connect with Tutors
                            </MenuItem>
                            <MenuItem onClick={handleLogoutClick}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
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
                                display: { xs: "none", sm: "block" },
                            }}
                            onClick={() => navigate("/register")}
                        >
                            Sign up
                        </Button>
                    </>
                )}
                </Box>
            </Toolbar>
             <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                  >
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to log out?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogClose} variant="contained" color="primary" sx={{background:"#550A8A"}}>
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmLogout} variant="contained" color="primary" sx={{background:"#550A8A"}} autoFocus>
                        Logout
                      </Button>
                    </DialogActions>
                  </Dialog>

        </AppBar>

    )
}

export default Navbar
