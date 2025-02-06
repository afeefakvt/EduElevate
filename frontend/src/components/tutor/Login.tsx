import { Box, Button, Container, TextField, Typography, Paper,Alert } from '@mui/material';
import  { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/tutorApi';
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { validateLoginForm } from '../../utils/validations';
import TutorForgotPasswordModal from './TutorForgotPasswordModal';



const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [errMessage,setErrMessage] = useState('')
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
    const [isModalOpen,setIsModalOpen] = useState(false)



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

      const handleOpenModal = ()=>setIsModalOpen(true)
      const handleCloseModal = ()=>setIsModalOpen(false)
    


    const handleLogin =async ()=>{
      setErrMessage('') 
      const errors = validateLoginForm(email, password);
      setFormErrors(errors); 

      // Stop submission if there are errors
      if (Object.keys(errors).length > 0) {
          return;
      }
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
                        autoComplete="current-password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        error= {Boolean(formErrors.password)}
                        helperText ={formErrors.password}
                    />
                    <Typography
                        variant="body2"
                        textAlign="end"
                        sx={{ marginBottom: 1, color: "#1e90ff", cursor: "pointer" }}
                      onClick={handleOpenModal}
                    >
                        Forgot password?
                    </Typography>
                    <TutorForgotPasswordModal open={isModalOpen} handleClose={handleCloseModal} />
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