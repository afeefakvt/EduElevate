import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';
import { useState } from 'react';
import { resetPassword } from '../../api/adminApi'; // API to reset password
import { useNavigate, useParams } from 'react-router-dom';

const TutorResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams(); // Get token from URL
    const navigate = useNavigate();

    console.log("Token from URL:", token);
    const handleResetPassword = async () => {
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.trim()==''||  confirmPassword.trim()=='') {
            setError('Fields cannot be empty');
            return;
        }
        if (password.length<6 || confirmPassword.length<6) {
            setError('Password should conatin atleast 6 characters');
            return;
        }

        try {
            await resetPassword(token, password,confirmPassword);
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/tutor/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Error resetting password');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={4} sx={{ marginTop: 8, padding: 4, borderRadius: 2 }}>
                <Typography component="h1" variant="h5" align="center">
                    Reset Password
                </Typography>
                {message && <Alert severity="success">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        sx={{ mt: 2 }}
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
