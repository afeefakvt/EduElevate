import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For dynamic routing
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Navbar from "../common/Navbar"; 
import Footer from "../common/Footer"; 

const CourseDetails = () => {
  const { id } = useParams(); 
  const [course, setCourse] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/courses/${id}`) // Fetch course details from API
//       .then((response) => response.json())
//       .then((data) => setCourse(data))
//       .catch((error) => console.error("Error fetching course details:", error));
//   }, [id]);

//   if (!course) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 20 }}>
        <Grid container spacing={4}>
          {/* Left Side: Course Image & Info */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2, boxShadow: 3 }}>
              {/* <CardMedia component="img" height="300" image={course.image} alt={course.name} />
              <CardContent>
                <Typography variant="h4" fontWeight="bold">
                  {course.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {course.instructor} | {course.reviews} Reviews
                </Typography>
              </CardContent> */}
            </Card>

            {/* Course Description */}
            <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {/* {course.description} */}
              </Typography>
            </Box>

            {/* Course Requirements */}
            <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Requirements for this course
              </Typography>
              <List>
                {/* {course.requirements.map((req, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={req} />
                  </ListItem>
                ))} */}
              </List>
            </Box>
          </Grid>

          {/* Right Side: Course Pricing & Purchase */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 3 }}>
              {/* <Typography variant="h4" fontWeight="bold" sx={{ color: "purple" }}>
                ₹{course.price}
              </Typography> */}
              <Divider sx={{ my: 2 }} />

              {/* Course Details */}
              <List>
                <ListItem>
                  <ListItemText primary="⏳ Course Duration: 30 hours" />
                </ListItem>
                <ListItem>
                  {/* <ListItemText primary={`📚 Course Level: ${course.level}`} /> */}
                </ListItem>
                <ListItem>
                  <ListItemText primary="🗣 Language: English" />
                </ListItem>
              </List>

              {/* Purchase Buttons */}
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2,background:"#6A0DAD" }}>
                Enroll Now
              </Button>
              <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
                Add to Wishlist
              </Button>

              {/* Course Includes */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  This course includes:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="✔️ Lifetime access" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✔️ 30-day money-back guarantee" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✔️ Free exercise files" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✔️ Certificate of completion" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✔️ Access on mobile, TV, and tablet" />
                  </ListItem>
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default CourseDetails;
