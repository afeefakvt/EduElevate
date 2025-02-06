import { Box, Button, Container, TextField, Typography, Paper,Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../api/tutorApi';
import { validateRegisterForm } from '../../utils/validations';

const Register = () => {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [title,setTitle] = useState("")
  const [bio,setBio] = useState("")
  const [errMessage,setErrMessage] = useState('')
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?:string;title?: string; bio?: string }>({});

  const navigate = useNavigate() 


  useEffect(()=>{
    if(
      name!== ""||email!==""||password!==""||confirmPassword!==""||title!==""||bio!==""
    ){
      setErrMessage('')
    }
  },[name,email,password,confirmPassword,title,bio])

  const handleSignUp = async()=>{
    
    setErrMessage('') 

    const errors = validateRegisterForm(name, email, password, confirmPassword,title, bio);
    setFormErrors(errors)


    // Stop submission if errors exist
    if (Object.keys(errors).length > 0) {
        return;
      }

    try {
       const response=await signUp(name,email,password,confirmPassword,title,bio)
       navigate('/tutor/verifyOtp',{state:{email}})   //pass email to the otp page
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
                    Register as Tutor
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
                        error= {Boolean(formErrors.name)}
                        helperText ={formErrors.name}
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
                        error= {Boolean(formErrors.email)}
                        helperText ={formErrors.email}
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
                        error= {Boolean(formErrors.password)}
                        helperText ={formErrors.password}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="conifrmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        error= {Boolean(formErrors.confirmPassword)}
                        helperText ={formErrors.confirmPassword}
                    />
                     
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="title"
                        label="title"
                        type="title"
                        id="title"
                        autoComplete="title"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        error= {Boolean(formErrors.title)}
                        helperText ={formErrors.title}
                    />
                     
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="bio"
                        label="bio"
                        type="bio"
                        id="bio"
                        autoComplete="bio"
                        value={bio}
                        onChange={(e)=>setBio(e.target.value)}
                        error= {Boolean(formErrors.bio)}
                        helperText ={formErrors.bio}
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
                        Register as Tutor
                    </Button>

                    
                    <Typography variant="body2" align="center">
                        Already have an account?{' '}
                        <Link to="/tutor/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;