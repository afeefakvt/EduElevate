import Register from '../tutor/Register'
import Navbar from '../tutor/Navbar'
import Footer from '../common/Footer'
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