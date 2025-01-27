import Otp from "../components/common/Otp";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Box } from "@mui/material";



const OtpPage = () => {
  return (
    <Box>
    <Navbar />
    <Box sx={{marginTop:30,marginBottom:25  }}> 
        <Otp />
    </Box>
    <Footer />
</Box>
  )
}

export default OtpPage