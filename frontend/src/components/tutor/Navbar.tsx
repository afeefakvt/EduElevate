import logo from "../../assets/afeefalogo.png"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Avatar, IconButton, Menu, MenuItem,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState, store,persistor } from "../../store/store";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect,useState } from "react";
import { tutorLogout } from "../../store/tutorAuthSlice";
import { logoutTutor } from "@/api/tutorApi";
import Cookies from "js-cookie";
import storage from 'redux-persist/lib/storage';


const Navbar = () => {

    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.tutorAuth.token)
    const tutor = useSelector((state: RootState) => state.tutorAuth.tutor)
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

    const handleConfirmLogout = async() => {
        try {
            console.log("Before logout:", Cookies.get("tutorAuthToken")); 
            dispatch(tutorLogout())
            await persistor.flush();
            storage.removeItem('persist:tutorAuth');
            console.log("After logout:", Cookies.get("tutorAuthToken"));
            await logoutTutor()
            localStorage.setItem("logoutSuccess","true")  //Store logout success message in local storage
            navigate('/tutor/login')
        } catch (error) {
            console.log(error);
        } finally{
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
                            px:2
                        }}
                        onClick={() => navigate("/tutor/home")} 

                        
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
                        onClick={() => navigate("/tutor/myCourses")} 

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
                            px:2
                        }}
                        onClick={() => navigate("/tutor/addCourse")} 

                    >
                        Add a course
                    </Typography>
                    {token ? (
                        <>
                        <IconButton onClick={handleMenuOpen}>
                            <Avatar 
                                // src={student?.profilePic || ""} 
                                alt={tutor?.name}
                                sx={{ width: 40, height: 40, bgcolor: "#550A8A", color: "white", fontSize: 18 }}
                            >
                                {tutor?.name?.charAt(0).toUpperCase()} {/* First letter if no image */}
                            </Avatar>
                        </IconButton>
    
                        {/* Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => { navigate("/tutorProfile"); handleMenuClose(); }}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => { navigate("/tutor/contacts"); handleMenuClose(); }}>
                                Connect with Students
                            </MenuItem>
                            <MenuItem onClick={() => { navigate("/tutor/payments"); handleMenuClose(); }}>
                                Payments
                            </MenuItem>
                            <MenuItem onClick={handleLogoutClick}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </>

                    ) : (
                        <Box display={"flex"} justifyContent="center" alignItems="center" gap={1}>
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
