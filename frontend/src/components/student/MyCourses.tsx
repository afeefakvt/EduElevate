import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem,Pagination } from "@mui/material";
import { getCategories } from "../../api/courseApi"
import { fetchEnrolledCourses } from "@/api/enrollmentApi";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useLocation } from "react-router-dom";
import {  getCourseRatings } from "@/api/ratingApi";
import { Category } from "@/interfaces/interface";
import { Enrollment } from "@/interfaces/interface";


const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const isSuccess = searchParams.get("success") === "true"
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [ratings, setRatings] = useState<{ [key: string]: { average: number; count: number } }>({})
  const [sortOption,setSortOption] = useState<string>("default")
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  // const [totalCourses,setTotalCourses] = useState(0)
  



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetchEnrolledCourses();
        console.log("repsonseeeeee")
        console.log("Fetched enrolled courses:", response);

        setEnrolledCourses(response);
      } catch (error) {
        console.error("Failed to fetch approved courses:", error);
      }
    };
    
    const fetchCategories = async()=>{
      try {
        const categories = await getCategories()
        // console.log(categories,"dvkdvndkfjndjfnk");
        
        const categoryResponse = categories.filter((category:Category)=>category.isListed===true)
        setCategories(categoryResponse)
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        
      }
    }
    fetchCourses();
    fetchCategories();
  }, [searchQuery,selectedCategory,sortOption,page]);

  // const totalPages = Math.ceil(totalCourses/rowsPerPage)

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingsData: { [key: string]: { average: number; count: number } } = {};
  
        for (const course of enrolledCourses) {
          const ratingResponse = await getCourseRatings(course.courseId._id);
          ratingsData[course.courseId._id] = {
            average: ratingResponse.average || 0,
            count: ratingResponse.ratings.length || 0
          };
        }
  
        setRatings(ratingsData);
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      }
    }
    if (enrolledCourses.length > 0) {
      fetchRatings();
    }
  }, [enrolledCourses])


  useEffect(() => {
    if (isSuccess) {
      setOpenSnackbar(true)
    }
  }, [isSuccess])

  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch = course.courseId.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.courseId.categoryId._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a,b)=>{
    if(sortOption==="priceAsc") return a.courseId.price- b.courseId.price;
    if(sortOption==="priceDesc") return b.courseId.price-a.courseId.price;
    if(sortOption==="ratingAsc") return (ratings[a.courseId._id]?.average || 0)-(ratings[b.courseId._id]?.average || 0);
    if(sortOption==="ratingDesc") return (ratings[b.courseId._id]?.average || 0)-(ratings[a.courseId._id]?.average || 0);

    return 0;
  }) 



  const totalPages = Math.ceil(sortedCourses.length / rowsPerPage);
  const paginatedCourses = sortedCourses.slice((page - 1) * rowsPerPage, page * rowsPerPage);


  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* Main content takes up remaining space */}
      <Container sx={{ mt: 15, mb: 15, flexGrow: 1 }}>
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
          
          <FormControl sx={{ minWidth: 200, ml: 2 }}>
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <MenuItem value="all">All Categories</MenuItem>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Categories Found</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, ml: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <MenuItem value="default">Default</MenuItem>
              <MenuItem value="priceAsc">Price: Low to High</MenuItem>
              <MenuItem value="priceDesc">Price: High to Low</MenuItem>
              <MenuItem value="ratingAsc">Rating: Low to High</MenuItem>
              <MenuItem value="ratingDesc">Rating: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>


        <Grid container spacing={4}>
          {paginatedCourses.length > 0 ? (
            paginatedCourses.map((course) => (
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
                      image={course.courseId.thumbnail}
                      alt={course.courseId.title}
                      sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h6" fontWeight="Bold">
                      {course.courseId.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" >
                      {/* {course.courseId.tutorId.name} */}
                    </Typography>
                    <Typography variant="h6" fontWeight="Bold" >
                      ₹{course.courseId.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.courseId.description}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      ⭐{ratings[course.courseId._id]?.average?.toFixed(1) || "N/A"}
                      ({ratings[course.courseId._id]?.count || 0} reviews)
                    </Typography>

                    <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "#550A8A" }} onClick={() => navigate(`/myCourses/${course.courseId._id}`)} >
                      Start Watching
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

        {totalPages > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5, }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{color:"#550A8A"}}
            />
          </Box>
        )}

      </Container>

      <Footer />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={isSuccess ? "success" : "error"}
        // variant="filled"

        >
          {isSuccess ? "Payment Successful! You have been enrolled in the course" : "Payment Failed. Please try again."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyCourses;
