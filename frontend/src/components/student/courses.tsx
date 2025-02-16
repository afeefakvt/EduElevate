import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {  getCategories } from "@/api/authApi";
import { getCourses } from "@/api/courseApi";
import { useNavigate } from "react-router-dom";
import { getCourseRatings } from "@/api/ratingApi";

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

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate= useNavigate()
  // const [categories, setCategories] = useState<Category[]>([])
  // const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [ratings, setRatings] = useState<{ [key: string]: { average: number; count: number } }>({})




  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseResponse = await getCourses();
        const approvedCourses = courseResponse.courses.filter((course: Course) => course.status === "approved");
        setCourses(approvedCourses);

        // const categoryResponse = await getCategories()
        // setCategories(categoryResponse.data.categories)
      } catch (error) {
        console.error("Failed to fetch approved courses:", error);
      }
    };
    fetchCourses();
  }, []);


   useEffect(() => {
      const fetchRatings = async () => {
        try {
          const ratingsData: { [key: string]: { average: number; count: number } } = {};
    
          for (const course of courses) {
            const ratingResponse = await getCourseRatings(course._id);
            ratingsData[course._id] = {
              average: ratingResponse.average || 0,
              count: ratingResponse.ratings.length || 0
            };
          }
    
          setRatings(ratingsData);
        } catch (error) {
          console.error("Failed to fetch ratings:", error);
        }
      }
      if (courses.length > 0) {
        fetchRatings();
      }
    }, [courses])

  const filteredCourses = courses.filter((course) => {
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
          Available Courses
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
                      ⭐{ratings[course._id]?.average?.toFixed(1) || "N/A"}
                      ({ratings[course._id]?.count || 0} reviews)
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
