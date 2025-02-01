import { Box, Button, Container, TextField, Typography, Paper,Alert } from '@mui/material';
import  { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/tutorAuthApi';
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";



const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [errMessage,setErrMessage] = useState('')

    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.tutorAuth.token);


    useEffect(()=>{
        if(email!=='' || password !==''){
            setErrMessage('')
        }
    },[email,password])


    useEffect(() => {
        if (token) {
          navigate("/tutor/home", { replace: true });  
        }
      }, [token, navigate]);
    


    const handleLogin =async ()=>{
      setErrMessage('') //clear previouserror message
      try {
        const tutorData = await login(email,password)
        if(tutorData){
            navigate('/tutor/home')
        }
      } catch (error:any) {        
        setErrMessage(error.message)
        console.error(errMessage)
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
                    Tutor Login
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
                        autoComplete="current-password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                        onClick={(e)=>{
                            e.preventDefault()
                            handleLogin()
                        }}
                    >
                        Login
                    </Button>

                    {/* Sign up link */}
                    <Typography variant="body2" align="center">
                        Don't have an account?{' '}
                        <Link to="/tutor/register" style={{ textDecoration: 'none', color: 'primary.main' }}>
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;