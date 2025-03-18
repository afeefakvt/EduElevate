import { Box, Button, Container, TextField, Typography, Paper, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { validateLoginForm } from '../../utils/validations';
import ForgotPasswordModal from './ForgotPasswordModal';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [errMessage, setErrMessage] = useState('')
    const [formErrors, setFormErrors] = useState<{ email?: string, password?: string }>({})
    const [isModalOpen,setIsModalOpen] = useState(false)

    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.auth.token)

    useEffect(() => {
        if (email !== '' || password !== '') {
            setErrMessage('')
        }
    }, [email, password])


    useEffect(() => {
        if (token) {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    const handleOpenModal = ()=>setIsModalOpen(true)
    const handleCloseModal = ()=>setIsModalOpen(false)

    const handleLogin = async () => {
        setErrMessage('') //clear previouserror message

        const errors = validateLoginForm(email, password);
        setFormErrors(errors);

        // Stop submission if there are errors
        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const studentData = await login(email, password)

            if (studentData) {
                navigate('/')
            }
        } catch (error: any) {
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
                    Student Login
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
                        onChange={(e) => setEmail(e.target.value)}
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
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <Typography
                        variant="body2"
                        textAlign="end"
                        sx={{ marginBottom: 1, color: "#1e90ff", cursor: "pointer" }}
                      onClick={handleOpenModal}
                    >
                        Forgot Password?
                    </Typography>
                    <ForgotPasswordModal open = {isModalOpen} handleClose={handleCloseModal}/>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2,background:"#550A8A" }}
                        onClick={(e) => {
                            e.preventDefault()
                            handleLogin()
                        }}
                    >
                        Login
                    </Button>
                    {/* Sign up link */}
                    <Typography variant="body2" align="center">
                        Don't have an account?{' '}
                        <Link to="/register" style={{ textDecoration: 'none', color: 'primary.main' }}>
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;