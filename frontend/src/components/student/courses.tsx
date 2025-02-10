import React, { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { getCourses } from "@/api/authApi";



interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  tutorId: { _id: string; name: string }
  categoryId: { _id: string; name: string }
  price: number;
  duration: string;
  status: string;

}
const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses()
        const approvedCourses = response.courses.filter((course: any) => course.status === "approved")
        setCourses(approvedCourses)

      } catch (error) {
        console.error("Failed to fetch approved courses:", error);


      }
    }
    fetchCourses()
  }, [])

  return (
    <div>
      <Navbar /> {/* Navbar at the top */}

      <Container sx={{ mt: 15 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          Available Courses
        </Typography><br />
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
              <Card sx={{ maxWidth: 345, height: "100%", display: "flex", flexDirection: "column", boxShadow: 3, borderRadius: 2 }}>
                <Box sx={{ height: 180, overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="100%"
                    image={course.thumbnail}
                    alt={course.title}
                    sx={{ objectFit: "cover", width: "100%" }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>

            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer /> {/* Footer at the bottom */}
    </div>
  );
};

export default Courses;



// import React, { useEffect, useState } from "react";
// import {
//   Box, Card, CardContent, CardMedia, Typography, Grid,
//   TextField, Select, MenuItem, InputLabel, FormControl
// } from "@mui/material";
// import { getCourses } from "@/api/authApi";


// const StudentApprovedCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");

//   useEffect(() => {
//     const fetchApprovedCourses = async () => {
//       try {
//         const response = await getCourses();
//         const approvedCourses = response.courses.filter((course) => course.status === "approved");
//         setCourses(approvedCourses);
//       } catch (error) {
//         console.error("Failed to fetch approved courses:", error);
//       }
//     };

//     fetchApprovedCourses();
//   }, []);

//   const filteredCourses = courses.filter(course =>
//     (category === "All" || course.category === category) &&
//     course.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box sx={{ width: "90%", margin: "auto", textAlign: "center", mt: 4 }}>
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         All Courses
//       </Typography>

//       {/* Search & Category Filter */}
//       <Box sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "center" }}>
//         <TextField
//           label="Search courses..."
//           variant="outlined"
//           fullWidth
//           sx={{ maxWidth: 400 }}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <FormControl sx={{ minWidth: 200 }}>
//           <InputLabel>Category</InputLabel>
//           <Select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <MenuItem value="All">All Categories</MenuItem>
//             <MenuItem value="Web Development">Web Development</MenuItem>
//             <MenuItem value="Machine Learning">Machine Learning</MenuItem>
//             <MenuItem value="Mobile Development">Mobile Development</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Course Grid */}
//       <Grid container spacing={3}>
//         {filteredCourses.map((course) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
//             <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
//               <CardMedia
//                 component="img"
//                 height="150"
//                 image={course.image}
//                 alt={course.name}
//               />
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold">
//                   {course.name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Instructor: {course.tutor}
//                 </Typography>
//                 <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
//                   ⭐ {course.rating} ({course.reviews} reviews)
//                 </Typography>
//                 <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold", color: "red" }}>
//                   ₹{course.discountedPrice}
//                   <Typography component="span" sx={{ textDecoration: "line-through", color: "gray", ml: 1 }}>
//                     ₹{course.originalPrice}
//                   </Typography>
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default StudentApprovedCourses;
