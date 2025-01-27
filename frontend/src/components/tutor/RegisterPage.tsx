import Register from '../tutor/Register'
import Navbar from '../tutor/Navbar'
import Footer from '../common/Footer'
import { Box, } from '@mui/material'


const RegisterPage = () => {


    return (
        <div>
            <Navbar />
            <Box sx={{ marginTop: 15 }}>
                <Register />
            </Box>
            <Footer />
        </div>

    )
}

export default RegisterPage