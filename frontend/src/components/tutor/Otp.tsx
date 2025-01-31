import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../api/tutorAuthApi';
import { useEffect, useState } from 'react';
import { resendOtp } from '../../api/tutorAuthApi';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { startOtpTimer,decrementOtpTimer,resetOtpTimer } from '@/store/otpSlice';

const Otp = () => {
    const [otp, setOtp] = useState('');
    const [errMessage, setErrMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email// Retrieve email from state


    //redux state
    const dispatch = useDispatch();
    const timer = useSelector((state:RootState)=>state.otp.timer);
    const isResendEnabled = useSelector((state:RootState)=>state.otp.isResendEnabled)

    useEffect(()=>{
        if(timer>0){
            const interval = setInterval(()=>{
                dispatch(decrementOtpTimer());
            },1000)
            return ()=>clearInterval(interval)
        }
    },[timer,dispatch])


    const handleVerifyOtp = async () => {
        setErrMessage('')
        setSuccessMessage('');
        try {
            await verifyOtp(email, otp)
            navigate('/tutor/login')
        } catch (error: any) {
            console.error("Verification Error:", error.response?.data || error.message);
            setErrMessage(error.message)
        }
    }


    const handleResendOtp = async () => {
        setErrMessage('');
        setSuccessMessage('');


        try {
            await resendOtp(email); 
            setSuccessMessage('A new OTP has been sent to your email.');
            dispatch(resetOtpTimer()); // Reset timer
            dispatch(startOtpTimer(60));

        } catch (error: any) {
            console.error('Resend OTP Error:', error.response?.data || error.message);
            setErrMessage('Failed to resend OTP. Please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs" 
         sx={{
                height: '100vh', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Navbar/>
         
            <Paper
                elevation={4}
                sx={{
                    marginTop: 2,
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
                        disabled={isResendEnabled} 
                    >
                        Resend OTP  {isResendEnabled && `(${timer}s)`}
                    </Button>
                </Box>
            </Paper>
          
        </Container>
    )
}

export default Otp