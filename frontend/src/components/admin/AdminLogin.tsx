import { Box, Button, Container, TextField, Typography, Paper,Alert ,IconButton, InputAdornment} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import  { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../api/adminApi';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import AdminNavbar from './AdminNavbar';
import { validateLoginForm } from '../../utils/validations';


const AdminLogin = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [errMessage,setErrMessage] = useState('')
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});


    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(()=>{
        if(email!=='' || password !==''){
            setErrMessage('')
        }
    },[email,password])


    
    useEffect(() => {
        if (token) {
          navigate("/admin/home", { replace: true });  
        }
      }, [token, navigate]);




    const handleLogin =async ()=>{
      
      setErrMessage('') //clear previouserror message
      const errors = validateLoginForm(email, password);
      setFormErrors(errors); 

      // Stop submission if there are errors
      if (Object.keys(errors).length > 0) {
          return;
      }

      try {
        const studentData = await loginAdmin(email,password)

        if(studentData){
            navigate('/admin/home')
        }
      } catch (error:any) {
        setErrMessage(error.message)
        console.error(errMessage)
      }

    }
    return (
        <Container component="main" maxWidth="xs">
            <AdminNavbar/>
            <Paper
                elevation={4}
                sx={{
                    marginTop: 22,
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2,
                }}
            >
                <Typography component="h1" variant="h5">
                    Admin Login
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
                        type={showPassword ? 'text' : 'password'}                       
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        error= {Boolean(formErrors.password)}
                        helperText ={formErrors.password}
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 ,background:"#550A8A"}}
                        onClick={(e)=>{
                            e.preventDefault()
                            handleLogin()
                        }}
                    >
                        Login
                    </Button>

                   
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminLogin;