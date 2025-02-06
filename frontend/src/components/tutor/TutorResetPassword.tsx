import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';
import { useState } from 'react';
import { resetPassword } from '../../api/tutorApi';
import { useNavigate, useParams } from 'react-router-dom';
import { validateResetPasswordForm } from '@/utils/validations';
import { useEffect } from 'react';

const TutorResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errMessage,setErrMessage] = useState('')
    const [formErrors,setFormErrors] = useState<{password?:string; confirmPassword?:string}>({})
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate();


    
      useEffect(()=>{
        if(
          password!==""||confirmPassword!==""
        ){
          setErrMessage('')
        }
      },[password,confirmPassword])

    const handleResetPassword = async () => {
        setMessage('');
        setErrMessage('')

        const errors = validateResetPasswordForm(password,confirmPassword)
        setFormErrors(errors)

        if (Object.keys(errors).length > 0) {
            return;
          }

        try {
            await resetPassword(token, password,confirmPassword);
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/tutor/login'), 3000);
        } catch (err: any) {
            setErrMessage(err.message || 'Error resetting password');
            console.error(errMessage);  

        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={4} sx={{ marginTop: 8, padding: 4, borderRadius: 2 }}>
                <Typography component="h1" variant="h5" align="center">
                    Reset Password
                </Typography>
                {message && <Alert severity="success">{message}</Alert>}
                {errMessage && <Alert severity="error">{errMessage}</Alert>}

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        error= {Boolean(formErrors.password)}
                        helperText ={formErrors.password}
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        sx={{ mt: 2 }}
                        error= {Boolean(formErrors.confirmPassword)}
                        helperText ={formErrors.confirmPassword}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default TutorResetPassword;
