import Register from '../components/common/Register'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Box ,} from '@mui/material'


const RegisterPage = () => {

  
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
        <Register />
    </Box>
    <Box sx={{marginTop:"54px",width:"100%"}}>
    <Footer />
    </Box>
   
</Box>
  )
}

export default RegisterPage