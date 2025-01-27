import Login from '../tutor/Login'
import Navbar from '../tutor/Navbar'
import Footer from '../common/Footer'
import { Box } from '@mui/material'

const LoginPage = () => {
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
            md: '74px', 
          },
          width:"100%"}}> 
        <Login />
    </Box>
    <Box sx={{marginTop:"74px",width:"100%"}}>
    <Footer />
    </Box>
   
</Box>
  )
}

export default LoginPage