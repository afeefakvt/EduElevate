import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../api/authApi';
import { useEffect, useState } from 'react';



const Otp = () => {
    const [otp, setOtp] = useState('');
    const [errMessage, setErrMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('');
    const [timer, setTimer] = useState<number>(60);//initil countdown time
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email// Retrieve email from state

    // useEffect(() => {
    //     if (timer > 0) {
    //         const interval = setInterval(() => {
    //             setTimer((prevTimer) => prevTimer - 1);
    //         }, 1000)
    //         return () => clearInterval(interval)
    //     } else {
    //         setIsResendDisabled(false)
    //     }
    // }, [timer])


    useEffect(() => {
        // Check if there's an existing timer in localStorage
        const storedTime = localStorage.getItem('otpTimer');
        const startTime = localStorage.getItem('otpStartTime');

        if (storedTime && startTime) {
            const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
            const remainingTime = Number(storedTime) - elapsed;

            if (remainingTime > 0) {
                setTimer(remainingTime);
                setIsResendDisabled(true);
            } else {
                setIsResendDisabled(false);
            }
        } else {
            // No stored timer, start a new one
            setTimer(60);
            setIsResendDisabled(true);
            localStorage.setItem('otpTimer', '60');
            localStorage.setItem('otpStartTime', String(Date.now()));
        }
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    const newTime = prevTimer - 1;
                    if (newTime <= 0) {
                        setIsResendDisabled(false);
                        localStorage.removeItem('otpTimer');
                        localStorage.removeItem('otpStartTime');
                        clearInterval(interval);
                    }
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);



    const handleVerifyOtp = async () => {
        setErrMessage('')
        setSuccessMessage('');
        try {
            await verifyOtp(email, otp)

            localStorage.removeItem('otpTimer');
            localStorage.removeItem('otpStartTime');

            navigate('/login')
        } catch (error: any) {
            setErrMessage(error.message)
        }
    }
    const handleResendOtp = async () => {
        setErrMessage('');
        setSuccessMessage('');
        setTimer(60)
        setIsResendDisabled(true); // Temporarily disable button


        localStorage.setItem('otpTimer', '60');
        localStorage.setItem('otpStartTime', String(Date.now()));

        try {
            await resendOtp(email);
            setSuccessMessage('A new OTP has been sent to your email.');
            console.log("New OTP sent.");

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
                        {isResendDisabled ? `Resend OTP in ${timer} seconds` : "Resend OTP"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default Otp