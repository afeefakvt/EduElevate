import Login from '../tutor/Login'
import Navbar from '../tutor/Navbar'
import Footer from '../common/Footer'
import { Box } from '@mui/material'

const LoginPage = () => {
  return (
    <div>
         <Navbar />
    <Box sx={{  marginTop:30, marginBottom:25}}> 
        <Login />
    </Box>
    <Footer />
    </div>
  
   

  )
}

export default LoginPage