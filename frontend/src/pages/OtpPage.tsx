import Otp from "../components/common/Otp";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Box } from "@mui/material";



const OtpPage = () => {
  return (
    <Box
    sx={{
        display: "flex",
        flexDirection: "column",
        width:"100vw",
       
    }}
>
    <Navbar />
    <Box sx={{  marginTop: {
            xs: '56px', 
            md: '64px', 
          },
          width:"100%"}}> 
        <Otp />
    </Box>
    <Box sx={{marginTop:"54px",width:"100%"}}>
    <Footer />
    </Box>
   
</Box>
  )
}

export default OtpPage