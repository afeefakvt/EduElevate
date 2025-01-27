import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp,resendOtp } from '../../api/authApi';
import { useState } from 'react';



const Otp = () => {
    const [otp,setOtp] = useState('');
    const [errMessage,setErrMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email// Retrieve email from state


    const handleVerifyOtp = async ()=>{
        setErrMessage('')
        setSuccessMessage('');
        try {
            await verifyOtp(email,otp)
            navigate('/login')
        } catch (error:any) {
            setErrMessage(error.message)
        }
    }
    const handleResendOtp = async () => {
            setErrMessage('');
            setSuccessMessage('');
            setIsResendDisabled(true); // Temporarily disable button
    
            try {
                await resendOtp(email); 
                setSuccessMessage('A new OTP has been sent to your email.');
                setTimeout(() => setIsResendDisabled(false), 60000); // Re-enable after 1 minute
    
            } catch (error: any) {
                console.error('Resend OTP Error:', error.response?.data || error.message);
                setErrMessage('Failed to resend OTP. Please try again.');
                setIsResendDisabled(false); // Re-enable immediately on error
            }
        };
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
            Verify OTP
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
            {/* Error Alert */}
                                {/* {errMessage && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {errMessage}
                                    </Alert>
                                )} */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Enter OTP"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            {errMessage && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {errMessage}
                </Typography>
            )}
            {successMessage && (
                        <Typography color="success" sx={{ mt: 1 }}>
                            {successMessage}
                        </Typography>
                    )}
            <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleVerifyOtp}
            >
                Verify OTP
            </Button>
            <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={handleResendOtp}
                        disabled={isResendDisabled} 
                    >
                        Resend OTP
                    </Button>
        </Box>
    </Paper>
</Container>
  )
}

export default Otp