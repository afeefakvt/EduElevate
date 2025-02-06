import { Box, Grid, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";


const Footer = () => {
  return (
    <Box
    sx={{
        backgroundColor: "#1c1c1c",
        color: "#9CA3AF",
        padding: "3rem 1rem",
        marginTop: "2rem",
        width:"100vw"
      }}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "1rem" }}
          >
            EDUELEVATE
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: "1.6" }}>
            Connecting learners with mentors worldwide <br /> to inspire growth and
            learning. Join us to gain <br /> skills or share your expertise.
          </Typography>

          <Box sx={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <InstagramIcon sx={{ fontSize: 25, cursor: "pointer" }} />
            <YouTubeIcon sx={{ fontSize: 25, cursor: "pointer" }} />
            <LinkedInIcon sx={{ fontSize: 25, cursor: "pointer" }} />
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "semi-bold", marginBottom: "1rem" }}
          >
            Top 4 Category
          </Typography>
          <Typography variant="body2">Web Development</Typography>
          <br />
          <Typography variant="body2">Machine Learning</Typography>
          <br />
          <Typography variant="body2">Mobile Development</Typography>
          <br />
          <Typography variant="body2">Game Development</Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "semi-bold", marginBottom: "1rem" }}
          >
            Quick Links
          </Typography>
          <Typography variant="body2">About</Typography>
          <br />
          <Typography variant="body2">Become Tutor</Typography>
          <br />
          <Typography variant="body2">Contact</Typography>
          <br />
          <Typography variant="body2">Career</Typography>
        </Grid>

     
        <Grid item xs={12} md={3}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "semi-bold", marginBottom: "1rem" }}
          >
            Support
          </Typography>
          <Typography variant="body2">Help Center</Typography>
          <br />
          <Typography variant="body2">FAQs</Typography>
          <br />
          <Typography variant="body2">Terms & Condition</Typography>
          <br />
          <Typography variant="body2">Privacy Policy</Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          marginTop: "2rem",
          borderTop: "1px solid #444",
          paddingTop: "1rem",
          textAlign: "center",
  
        }}
      >
        <Typography variant="body2">
          © 2025 EduElevate. All rights reserved
        </Typography>
      </Box>

    </Box>
    
  )
}

export default Footer