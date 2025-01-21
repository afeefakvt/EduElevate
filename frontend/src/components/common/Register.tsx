import {
    Box,
    Button,
    Divider,
    TextField,
    Typography,
    Link,
  } from "@mui/material";
  import login from "../../assets/login.jpg";
  
  const Register = () => {
    return (
      <Box
        sx={{
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   minHeight: "100%",
        //   backgroundColor: "#FFEDE7",

        display:"flex",
        flexDirection:{xs:"column",md:"row"},
        bgcolor:"#fdf4f4",
        padding:{xs:"2rem 1rem",md:"4rem"},
        height:"100vh",
        width:"100%",
     
          
        }}
      >
       
          {/* Form Section */}
          <Box
            sx={{
              flex: 1,
              padding: "40px 30px",
              backgroundColor:"#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: 3,
                textTransform: "uppercase",
                color: "#4B0082",
              }}
            >
              Create Your Account
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Full Name"
              placeholder="Enter your full name..."
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Email ID"
              placeholder="Enter your email ID..."
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Mobile Number"
              placeholder="Enter your mobile number..."
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Password"
              type="password"
              placeholder="Enter your password..."
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password..."
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "#4B0082",
                "&:hover": {
                  backgroundColor: "#6a0dad",
                },
              }}
            >
              Sign Up
            </Button>
            <Divider sx={{ my: 3 }}>OR</Divider>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderColor: "#4B0082",
                color: "#4B0082",
                "&:hover": {
                  borderColor: "#6a0dad",
                  backgroundColor: "#f2e8ff",
                },
              }}
            >
              Login with Google
            </Button>
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/login" underline="hover" color="primary">
                Login
              </Link>
            </Typography>
          </Box>
  
          {/* Image Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFEAE6",
              padding: "20px",
            }}
          >
            <img
              src={login}
              alt="Register Illustration"
              style={{
                width: "80%",
                maxWidth: "300px",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
    
    );
  };
  
  export default Register;