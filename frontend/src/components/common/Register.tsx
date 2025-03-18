import { Box, Button, Container, TextField, Typography, Paper,Alert , IconButton, InputAdornment} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../api/authApi';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { googleSignIn } from '../../api/authApi';
import { validateStudentRegisterForm } from '../../utils/validations'
;

const Register = () => {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword,setConfirmPassword] = useState("")
  const [errMessage,setErrMessage] = useState('')
  const [formErrors,setFormErrors] = useState<{name?:string,email?:string,password?:string,confirmPassword?:string}>({})

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

    const errors = validateStudentRegisterForm(name,email,password,confirmPassword)
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
        return;
      }

    try {
      console.log({ name, email,password, confirmPassword })
      
       const response=await signUp(name,email,password,confirmPassword)
       console.log('Sign up response:', response);
       navigate('/verifyOtp',{state:{email}})   //pass email to the otp page
    } catch (error:any) {
      setErrMessage(error.message)
      console.error(errMessage);  
    }
  }

  const handleGoogleLogin = async(credentialResponse:CredentialResponse)=>{
    try {
        if(credentialResponse.credential){
            const studentData = await googleSignIn(credentialResponse.credential);
            navigate('/')
        }
    } catch (error) {
        setErrMessage("Your account is temporarily suspended");
        console.log(errMessage);   
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
                        error={Boolean(formErrors.name)}
                        helperText={formErrors.name}
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
                        error={Boolean(formErrors.email)}
                        helperText={formErrors.email}
                    />
                  
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}                        
                        id="password"
                        autoComplete="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        error={Boolean(formErrors.password)}
                        helperText={formErrors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                        error={Boolean(formErrors.confirmPassword)}
                        helperText={formErrors.confirmPassword}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2,background:"#550A8A" }}
                        onClick={(e)=>{
                          e.preventDefault()
                          handleSignUp()}}
                    >
                        Register
                    </Button>
                    <Button fullWidth sx={{mt:2,mb:2}}>
                    <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setErrMessage("Google Sign-In Failed")} />

                    </Button>  
                    <Typography variant="body2" align="center">
                        Already have an account?{' '}
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



// import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { signUp } from '../../api/authApi';
// import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
// import { googleSignIn } from '../../api/authApi';

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errMessage, setErrMessage] = useState('');

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (name !== "" || email !== "" || password !== "" || confirmPassword !== "") {
//       setErrMessage('');
//     }
//   }, [name, email, password, confirmPassword]);

//   const handleSignUp = async () => {
//     setErrMessage('');
//     try {
//       console.log({ name, email, password, confirmPassword });
//       const response = await signUp(name, email, password, confirmPassword);
//       console.log('Sign up response:', response);
//       navigate('/verifyOtp', { state: { email } }); // Pass email to the OTP page
//     } catch (error: any) {
//       setErrMessage(error.message);
//       console.error(errMessage);
//     }
//   };

//   const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
//     try {
//       if (credentialResponse.credential) {
//         const studentData = await googleSignIn(credentialResponse.credential);
//         navigate('/');
//       }
//     } catch (error) {
//       setErrMessage("Your account is temporarily suspended");
//       console.log(errMessage);
//     }
//   };

//   return (
//     <Box sx={{ 
//       backgroundColor: "#FDECE2", // Light peach background
//       minHeight: "100vh", // Full height
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center"
//     }}>
//       <Container component="main" maxWidth="md"> {/* Increased width */}
//         <Paper
//           elevation={4}
//           sx={{
//             display: 'flex',
//             flexDirection: 'row', 
//             padding: 4,
//             alignItems: 'center',
//             borderRadius: 2,
//             backgroundColor: "white", // White form background
//           }}
//         >
//           {/* Left Side - Form */}
//           <Box sx={{ flex: 1, paddingRight: 4 }}>
//             <Typography component="h1" variant="h5" fontWeight="bold" mb={2}>
//               CREATE YOUR TUTOR ACCOUNT
//             </Typography>

//             {/* Error Alert */}
//             {errMessage && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {errMessage}
//               </Alert>
//             )}

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="name"
//               label="Enter your full name..."
//               id="name"
//               autoComplete="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Enter your email ID"
//               name="email"
//               autoComplete="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="confirmPassword"
//               label="Confirm Password"
//               type="password"
//               id="confirmPassword"
//               autoComplete="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="title"
//               label="Your Title"
//               id="title"
//             />

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="bio"
//               label="Your Bio"
//               id="bio"
//               multiline
//               rows={3}
//             />

//             <Button
//               fullWidth
//               variant="contained"
//               sx={{
//                 mt: 2,
//                 mb: 2,
//                 backgroundColor: "#3D0076", // Dark purple
//                 color: "white",
//                 "&:hover": {
//                   backgroundColor: "#2C0054"
//                 }
//               }}
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleSignUp();
//               }}
//             >
//               BECOME A TUTOR
//             </Button>

//             <Typography textAlign="center" mb={1}>
//               ——— OR ———
//             </Typography>

//             <Button
//               fullWidth
//               sx={{
//                 backgroundColor: "#3D0076",
//                 color: "white",
//                 "&:hover": {
//                   backgroundColor: "#2C0054"
//                 }
//               }}
//             >
//               <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setErrMessage("Google Sign-In Failed")} />
//             </Button>

//             <Typography variant="body2" align="center" mt={2}>
//               Already have a tutor account?{" "}
//               <Link to="/login" style={{ textDecoration: 'none', color: '#3D0076', fontWeight: "bold" }}>
//                 Login
//               </Link>
//             </Typography>
//           </Box>

//           {/* Right Side - Illustration */}
//           <Box sx={{ flex: 1, textAlign: "center" }}>
//             <img src="/tutor-illustration.png" alt="Tutor Illustration" style={{ width: "80%" }} />
//           </Box>

//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default Register;
