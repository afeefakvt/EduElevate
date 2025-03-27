import Login from '../components/common/Login'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Box } from '@mui/material'

const LoginPage = () => {
  return (
    <Box>
    <Navbar />
    <Box sx={{  marginTop:25,marginBottom:25}}> 
        <Login />
    </Box>
    <Footer />
</Box>
  )
}

export default LoginPage