import { Box,Typography,Button } from '@mui/material'
import bannerImage from "../../assets/tutorbanner.webp"

const Banner = () => {
  return (
   <Box
   sx={{
    display:"flex",
    flexDirection:{xs:"column",md:"row"},
    alignItems:"center",
    justifyContent:"space-between",
    bgcolor:"#FBEAEB",
    padding:{xs:"2rem 1rem",md:"4rem"},
    height:"100vh",
    width:"100vw",
    overflow:"hidden",
    boxSizing:"border-box"
   }}>
      {/* Left Section - Text */}
    <Box
    sx={{
        flex:1,
        textAlign:{xs:"center",md:"left"},
        maxWidth:"600px",
        paddingRight:{md:"2rem"},
        paddingTop:{md:"5rem"}
    }}>
        <Typography
        variant='h2'
        sx={{
            fontSize:{xs:"2rem",md:"3.5rem"},
            fontWeight:"bold",
            color:"#2e2e2e",
            lineHeight:"1.2"
        }}>
             <span style={{color:"#6A0DAD"}}>Educate!</span>  <br/>
            Smart Is Great.
        </Typography>
        <Typography variant='body1'
        sx={{
            color:"#555",
            margin:"1rem 0",
            fontSize:{xs:"1rem",md:"1.2rem"},
        }}>
            Skip the "what should I learn next?" confusion. Follow our structured
          paths, build awesome projects, and get expert help whenever you need
          it.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#6A0DAD",
            color: "white",
            padding: "0.8rem 2rem",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#550A8A",
            },
          }}
        >
          Get Started
        </Button>

    </Box>
      {/* Right Section - Image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "1rem", md: "0" },
          paddingTop:{md:"5rem"}
        }}
      >
         <img
          src={bannerImage}
          alt="Industry Experts Illustration"
          style={{
            maxWidth: "600px",
            height: "auto",
            borderRadius: "12px",
          }}
        />
      </Box>
    
   </Box>
  )
}

export default Banner