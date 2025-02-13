import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {  getCategories } from "@/api/authApi";
import { fetchEnrolledCourses } from "@/api/enrollmentApi";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  tutorId: { _id: string; name: string };
  categoryId: { _id: string; name: string };
  price: number;
  duration: string;
  status: string;
}


// interface Category {
//   _id: string;
//   name: string;
//   isListed: boolean;
// }

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate= useNavigate()
  // const [categories, setCategories] = useState<Category[]>([])
  // const [selectedCategory, setSelectedCategory] = useState<string>("all");



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetchEnrolledCourses();
        setEnrolledCourses(response);

        // const categoryResponse = await getCategories()
        // setCategories(categoryResponse.data.categories)
      } catch (error) {
        console.error("Failed to fetch approved courses:", error);
      }
    };
    fetchCourses();
  }, []);


  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesCategory = selectedCategory === "all" || course.categoryId.name === selectedCategory;
    return matchesSearch 
  });

 



  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* Main content takes up remaining space */}
      <Container sx={{ mt: 15,mb:15, flexGrow: 1 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Enrolled Courses
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5, mt: 5 }}>
          <TextField
            label="Search courses..."
            variant="outlined"
            fullWidth
            sx={{ maxWidth: 1200, flex: 1 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
{/* 
          <FormControl sx={{ minWidth: 200, ml: 2 }}>
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <MenuItem value="all">All Categories</MenuItem>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category._id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Categories Found</MenuItem>
              )}
            </Select>
          </FormControl> */}
        </Box>


        <Grid container spacing={4}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 10,
                    },
                  }}
                >
                  <Box sx={{ height: 150, overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={course.thumbnail}
                      alt={course.title}
                      sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h6" fontWeight="Bold">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" >
                      {course.tutorId.name}
                    </Typography>
                    <Typography variant="h6" fontWeight="Bold" >
                      ₹{course.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      ⭐4.6 (30,000)
                    </Typography>

                    <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "#550A8A" }} onClick={()=>navigate(`/courses/${course._id}`)} >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary" sx={{ width: "100%", textAlign: "center", mt: 5 }}>
              No courses found
            </Typography>
          )}
        </Grid>

      </Container>

      <Footer />
    </Box>
  );
};

export default MyCourses;
