import { Card,Typography,Button ,Box} from "@mui/material"
import { useNavigate } from "react-router-dom"

const BecomeStudent = () => {

    const navigate = useNavigate()
  return (
    <Box
    sx={{
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      padding: "3rem",
      borderRadius: "8px",
      gap: "1rem",
      width: "100vw",
      flexWrap: "wrap"
    }}
  >

    <Card sx={{ maxWidth: 400, textAlign: "center", padding: "4rem", backgroundColor: "white" }}>
      <Typography variant="h5" sx={{ color: "#550A8A", fontWeight: "bold" }}>Register as Student</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ margin: "1rem 0" }}>
      Unlock Your Potential!
      Take the first step toward your dream career. Learn from expert tutors, enhance your skills, and achieve your goals      </Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#550A8A" }}
        onClick={() => navigate('/register')}
      >
        Register Now
      </Button>
    </Card>

    <Box sx={{ textAlign: "left", maxWidth: 400 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", }}>Clear and Inspiring</Typography>
      <ol style={{ padding: 0, listStyleType: "none" }}>
        <li><strong style={{ color: "#550A8A" }}>1. Start Your Learning Journey</strong>
          - Choose from a variety of courses designed to build your skills and confidence.</li>
        <li><strong style={{ color: "#550A8A" }}>2. Learn from Experts</strong>
          - Gain insights from experienced tutors who are passionate about teaching.</li>
        <li><strong style={{ color: "#550A8A" }}>3. Achieve Your Goals</strong>
          - Develop skills that stay with you forever.</li>
      </ol>
    </Box>
  </Box>
  )
}

export default BecomeStudent
