import React, { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";

const Courses = () => {
  const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/courses") // Replace with your API endpoint
//       .then((response) => response.json())
//       .then((data) => setCourses(data))
//       .catch((error) => console.error("Error fetching courses:", error));
//   }, []);

  return (
    <div>
      <Navbar /> {/* Navbar at the top */}

      <Container sx={{ mt: 15 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          Available Courses
        </Typography>
        <Grid container spacing={4}>
          {/* {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
                <CardMedia component="img" height="180" image={course.image} alt={course.name} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))} */}
        </Grid>
      </Container>

      <Footer /> {/* Footer at the bottom */}
    </div>
  );
};

export default Courses;
