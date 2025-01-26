// import {
//     Box,
//     Button,
//     Divider,
//     TextField,
//     Typography,
//     Link,
//   } from "@mui/material";
//   import login from "../../assets/login.jpg";
  
//   const Register = () => {
//     return (
//       <Box
//         sx={{
//         //   display: "flex",
//         //   justifyContent: "center",
//         //   alignItems: "center",
//         //   minHeight: "100%",
//         //   backgroundColor: "#FFEDE7",

//         display:"flex",
//         flexDirection:{xs:"column",md:"row"},
//         bgcolor:"#fdf4f4",
//         padding:{xs:"2rem 1rem",md:"4rem"},
//         height:"100vh",
//         width:"100%",
     
          
//         }}
//       >
       
//           {/* Form Section */}
//           <Box
//             sx={{
//               flex: 1,
//               padding: "40px 30px",
//               backgroundColor:"#fff",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: "bold",
//                 textAlign: "center",
//                 mb: 3,
//                 textTransform: "uppercase",
//                 color: "#4B0082",
//               }}
//             >
//               Create Your Account
//             </Typography>
//             <TextField
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               label="Full Name"
//               placeholder="Enter your full name..."
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               label="Email ID"
//               placeholder="Enter your email ID..."
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               label="Mobile Number"
//               placeholder="Enter your mobile number..."
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               label="Password"
//               type="password"
//               placeholder="Enter your password..."
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               label="Confirm Password"
//               type="password"
//               placeholder="Confirm your password..."
//             />
//             <Button
//               fullWidth
//               variant="contained"
//               sx={{
//                 mt: 3,
//                 py: 1.5,
//                 fontWeight: "bold",
//                 backgroundColor: "#4B0082",
//                 "&:hover": {
//                   backgroundColor: "#6a0dad",
//                 },
//               }}
//             >
//               Sign Up
//             </Button>
//             <Divider sx={{ my: 3 }}>OR</Divider>
//             <Button
//               fullWidth
//               variant="outlined"
//               sx={{
//                 py: 1.5,
//                 fontWeight: "bold",
//                 borderColor: "#4B0082",
//                 color: "#4B0082",
//                 "&:hover": {
//                   borderColor: "#6a0dad",
//                   backgroundColor: "#f2e8ff",
//                 },
//               }}
//             >
//               Login with Google
//             </Button>
//             <Typography sx={{ mt: 2, textAlign: "center" }}>
//               Already have an account?{" "}
//               <Link href="/login" underline="hover" color="primary">
//                 Login
//               </Link>
//             </Typography>
//           </Box>
  
//           {/* Image Section */}
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: "#FFEAE6",
//               padding: "20px",
//             }}
//           >
//             <img
//               src={login}
//               alt="Register Illustration"
//               style={{
//                 width: "80%",
//                 maxWidth: "300px",
//                 borderRadius: "8px",
//               }}
//             />
//           </Box>
//         </Box>
    
//     );
//   };
  
//   export default Register;

// import { Box, Grid, Typography, TextField, Button } from "@mui/material";
// import { Link } from "react-router-dom";
//  import login from "../../assets/login.jpg";




// const Register = () => {
//   return (
//     <Box>
//       <Grid container sx={{height:'100vh',width:"100%"}}>
      
//           <Grid item
//           xs={12}
//           md={6}
//           sx={{
//             backgroundColor: "white",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: 4,
//             marginLeft: { xs: 7, sm: 0 },
//           }}>

// <Typography
//             variant="h3"
//             sx={{
//               textAlign: "start",
//               display: "block",
//               fontSize: { xs: "1.6rem", sm: "2rem" },
//             }}
//             gutterBottom
//           >
//             Join Skillify
//           </Typography>
//           <Typography variant="body1" sx={{ marginTop: 0 }}>
//             Sign up to start your amazing learning journey <br />
//             with{" "}
//             <span style={{ color: "#999999", fontWeight: "bold" }}>
//               Skillify
//             </span>{" "}
//           </Typography>
//           {/* <Box sx={{ minHeight: "20px" }}>
//             <Typography variant="caption" color="red">
//               {errorMessage || "\u00A0"}
//             </Typography>
//           </Box> */}

// <Box sx={{ minHeight: "20px" }}>
//             {/* <Typography variant="caption" color="red">
//               {errorMessage || "\u00A0"}
//             </Typography> */}
//           </Box>

//           <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
//             <TextField
//               label="Full Name"
//               variant="outlined"
//               fullWidth
//               sx={{ marginTop: 1 }}
//               // value={name}
//               // onChange={(e) => setName(e.target.value)}
//             />
//             <TextField
//               label="Email address"
//               variant="outlined"
//               fullWidth
//               sx={{ marginTop: 1 }}
//               // value={email}
//               // onChange={(e) => setEmail(e.target.value)}
//             />
//             <TextField
//               label="Password"
//               type="password"
//               variant="outlined"
//               fullWidth
//               sx={{ marginTop: 1 }}
//               // value={password}
//               // onChange={(e) => setPassword(e.target.value)}
//             />
//             <TextField
//               label="Confirm Password"
//               variant="outlined"
//               type="password"
//               fullWidth
//               sx={{ marginTop: 1 }}
//               // value={confirmPassword}
//               // onChange={(e) => setConfirmPassword(e.target.value)}
//             />

//             <Box display={"flex"} justifyContent={"center"}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{ marginTop: 1, width: "30%" }}
//                 // onClick={handleSignup}
//                 disabled={status === "loading"}
//               >
//                 {status === "loading" ? "Signing up" : "Sign up"}
//               </Button>
//             </Box>

//             <Typography variant="body2" textAlign="center" marginTop={1}>
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 style={{ textDecoration: "none", color: "#1e90ff" }}
//               >
//                 Login
//               </Link>
//             </Typography>
//           </Box>
//           <Typography variant="subtitle2" marginTop={1}>
//             <span style={{ color: "grey" }}>--------- </span>Or{" "}
//             <span style={{ color: "grey" }}>--------- </span>
//           </Typography>
//           <Button
//             variant="outlined"
//             startIcon={
//               <img
//                 src="/images/search.png"
//                 alt="Google logo"
//                 style={{ height: "20px", width: "20px", paddingLeft: "10px" }}
//               />
//             }
//             sx={{
//               maxWidth: 400,
//               width: { xs: "10%", sm: "40%" },
//               height: "8%",
//               marginTop: 1,
//               borderRadius: "24px",
//               borderColor: "grey",
//               bgcolor: "#f0f0f0",
//             }}
//           >
//             <Typography
//               variant="body2"
//               sx={{ display: { xs: "none", sm: "block" } }}
//             >
//               Sign in with Google
//             </Typography>
//           </Button>

//           </Grid>
//           <Grid item xs={12} md={6} sx={{ backgroundColor: "#2563EB",
//             color: "white",
//             display: { xs: "none", sm: "flex" },
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: 8,
//             px: 18,}}>

//             <Typography
//             variant="h3"
//             fontWeight="bold"
//             align="center"
//             textAlign="start"
//             gutterBottom
//           >
//             Welcome to our community
//           </Typography>
//           <Typography variant="h6" textAlign="start" sx={{ marginBottom: 4 }}>
//             <span style={{ color: "#999999", fontWeight: "bold" }}>
//               Skillify
//             </span>{" "}
//             provides you with an exceptional option to learn and upskill without
//             any problems. You can learn at your own pace from your comfort zone.
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               textAlign: "left",
//               flexDirection: "column",
//             }}
//           ></Box>
//           </Grid>



//           </Grid>

//     </Box>
//   )
// }

// export default Register



// import { Box, Grid, Typography, TextField, Button } from "@mui/material";
// import { Link } from "react-router-dom";
// import login from '../../assets/login.jpg'

// const Register = () => {
//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         width: "100%",
//         backgroundColor: "pink", // Set the background color to pink
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Grid container sx={{ height: "80%", width: "80%" }}>
//         {/* Left Side: Input Fields */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: 4,
//             backgroundColor: "white", // Optional: Add a white background for contrast
//             borderRadius: 2,
//             boxShadow: 2,
//           }}
//         >
//           <Typography
//             variant="h3"
//             sx={{
//               textAlign: "start",
//               display: "block",
//               fontSize: { xs: "1.6rem", sm: "2rem" },
//               marginBottom: 2,
//             }}
//             gutterBottom
//           >
//             CREATE AN ACCOUNT
//           </Typography>
//           <Typography variant="body1" sx={{ marginBottom: 3, textAlign: "center" }}>
//             Sign up to start your amazing learning journey <br />
//             with{" "}
//             <span style={{ color: "#999999", fontWeight: "bold" }}>
//               eduelevate
//             </span>
//           </Typography>

//           <Box component="form" sx={{ width: "100%", maxWidth: 400 }}>
//             <TextField
//               label="Full Name"
//               variant="outlined"
//               fullWidth
//               sx={{ marginBottom: 2 }}
//             />
//             <TextField
//               label="Email address"
//               variant="outlined"
//               fullWidth
//               sx={{ marginBottom: 2 }}
//             />
//             <TextField
//               label="Password"
//               type="password"
//               variant="outlined"
//               fullWidth
//               sx={{ marginBottom: 2 }}
//             />
//             <TextField
//               label="Confirm Password"
//               type="password"
//               variant="outlined"
//               fullWidth
//               sx={{ marginBottom: 2 }}
//             />

//             <Button
//               variant="contained"
//               color="primary"
//               sx={{ marginTop: 1, width: "100%" }}
//             >
//               Sign up
//             </Button>
//           </Box>

//           <Typography variant="body2" textAlign="center" marginTop={2}>
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               style={{ textDecoration: "none", color: "#1e90ff" }}
//             >
//               Login
//             </Link>
//           </Typography>
//         </Grid>

//         {/* Right Side: Image */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "pink", // Match the background color
//           }}
//         >
//           <img
//             src={login}
//             alt="Skillify illustration"
//             style={{
//               width: "80%",
//               height: "auto",
//               borderRadius: "8px",
//               boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//             }}
//           />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Register;






// import * as React from 'react';
// import {
//   Button,
//   FormControl,
//   FormControlLabel,
//   Checkbox,
//   InputLabel,
//   OutlinedInput,
//   TextField,
//   InputAdornment,
//   Link,
//   Alert,
//   IconButton,
// } from '@mui/material';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { SignInPage } from '@toolpad/core/SignInPage';
// import { useTheme } from '@mui/material/styles';

// const providers = [{ id: 'credentials', name: 'Email and Password' }];

// function CustomEmailField() {
//   return (
//     <TextField
//       id="input-with-icon-textfield"
//       label="Email"
//       name="email"
//       type="email"
//       size="small"
//       required
//       fullWidth
//       slotProps={{
//         input: {
//           startAdornment: (
//             <InputAdornment position="start">
//               <AccountCircle fontSize="inherit" />
//             </InputAdornment>
//           ),
//         },
//       }}
//       variant="outlined"
//     />
//   );
// }

// function CustomPasswordField() {
//   const [showPassword, setShowPassword] = React.useState(false);

//   const handleClickShowPassword = () => setShowPassword((show) => !show);

//   const handleMouseDownPassword = (event: React.MouseEvent) => {
//     event.preventDefault();
//   };

//   return (
//     <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
//       <InputLabel size="small" htmlFor="outlined-adornment-password">
//         Password
//       </InputLabel>
//       <OutlinedInput
//         id="outlined-adornment-password"
//         type={showPassword ? 'text' : 'password'}
//         name="password"
//         size="small"
//         endAdornment={
//           <InputAdornment position="end">
//             <IconButton
//               aria-label="toggle password visibility"
//               onClick={handleClickShowPassword}
//               onMouseDown={handleMouseDownPassword}
//               edge="end"
//               size="small"
//             >
//               {showPassword ? (
//                 <VisibilityOff fontSize="inherit" />
//               ) : (
//                 <Visibility fontSize="inherit" />
//               )}
//             </IconButton>
//           </InputAdornment>
//         }
//         label="Password"
//       />
//     </FormControl>
//   );
// }

// function CustomButton() {
//   return (
//     <Button
//       type="submit"
//       variant="outlined"
//       color="info"
//       size="small"
//       disableElevation
//       fullWidth
//       sx={{ my: 2 }}
//     >
//       Log In
//     </Button>
//   );
// }

// function SignUpLink() {
//   return (
//     <Link href="/" variant="body2">
//       Sign up
//     </Link>
//   );
// }

// function ForgotPasswordLink() {
//   return (
//     <Link href="/" variant="body2">
//       Forgot password?
//     </Link>
//   );
// }

// function Title() {
//   return <h2 style={{ marginBottom: 8 }}>Login</h2>;
// }

// function Subtitle() {
//   return (
//     <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity="warning">
//       We are investigating an ongoing outage.
//     </Alert>
//   );
// }

// function AgreeWithTerms() {
//   return (
//     <FormControlLabel
//       control={
//         <Checkbox
//           name="tandc"
//           value="true"
//           color="primary"
//           sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
//         />
//       }
//       slotProps={{
//         typography: {
//           fontSize: 14,
//         },
//       }}
//       color="textSecondary"
//       label="I agree with the T&C"
//     />
//   );
// }

// export default function SlotsSignIn() {
//   const theme = useTheme();
//   return (
//     <AppProvider theme={theme}>
//       <SignInPage
//         signIn={(provider, formData) =>
//           alert(
//             `Logging in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}, and checkbox value: ${formData.get('tandc')}`,
//           )
//         }
//         slots={{
//           title: Title,
//           subtitle: Subtitle,
//           emailField: CustomEmailField,
//           passwordField: CustomPasswordField,
//           submitButton: CustomButton,
//           signUpLink: SignUpLink,
//           rememberMe: AgreeWithTerms,
//           forgotPasswordLink: ForgotPasswordLink,
//         }}
//         providers={providers}
//       />
//     </AppProvider>
//   );
// }




import { Box, Button, Container, TextField, Typography, Paper,Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../api/authApi';

const Register = () => {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [errMessage,setErrMessage] = useState('')

  const navigate = useNavigate() 


  useEffect(()=>{
    if(
      name!== ""||email!==""||password!==""||confirmPassword!==""
    ){
      setErrMessage('')
    }
  },[name,email,password,confirmPassword])

  const handleSignUp = async()=>{
    setErrMessage('') 
    try {
      console.log('tfvyhjvbjhhbikjmnk,');
      console.log({ name, email,password, confirmPassword })
      
       const response=await signUp(name,email,password,confirmPassword)
       console.log('Sign up response:', response);
       navigate('/verifyOtp',{state:{email}})   //pass email to the otp page
    } catch (error:any) {
      setErrMessage(error.message)
      console.error(errMessage);  
    }
  }
    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={4}
                sx={{
                    marginTop: 8,
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2,
                    
                }}
            >
                <Typography component="h1" variant="h5">
                    Register as Student
                </Typography>
                <Box component="form" sx={{ mt: 3 }}>
                  {/* Error Alert */}
                                      {errMessage && (
                                          <Alert severity="error" sx={{ mb: 2 }}>
                                              {errMessage}
                                          </Alert>
                                      )}
                <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="name"
                        label="Full Name"
                        type="name"
                        id="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                  
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="confirmPassword"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                        onClick={(e)=>{
                          e.preventDefault()
                          handleSignUp()}}
                    >
                        Register
                    </Button>

                    
                    <Typography variant="body2" align="center">
                        Don't have an account?{' '}
                        <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;