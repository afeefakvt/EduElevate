import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../api/authApi';
import { useState } from 'react';


const Otp = () => {
    const [otp,setOtp] = useState('');
    const [errMessage,setErrMessage] = useState('')
    const navigate = useNavigate()
    const location = useLocation()// Use location to get state
    const email = location.state?.email// Retrieve email from state


    const handleVerifyOtp = async ()=>{
        setErrMessage('')
        try {
            await verifyOtp(email,otp)
            navigate('/login')
        } catch (error:any) {
            setErrMessage(error.message)
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
            <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleVerifyOtp}
            >
                Verify OTP
            </Button>
        </Box>
    </Paper>
</Container>
  )
}

export default Otp