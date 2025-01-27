import Register from '../components/common/Register'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Box ,} from '@mui/material'


const RegisterPage = () => {

  
  return (
    <Box>
    <Navbar />
    <Box sx={{  marginTop:15}}> 
        <Register />
    </Box>
    <Footer />
    </Box>
   
  )
}

export default RegisterPage