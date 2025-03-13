import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "./Navbar";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem,Pagination } from "@mui/material";
import { getCategories, getEnrollmentCount } from '../../api/tutorApi'
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import { fetchTutorCourses } from "@/api/tutorApi";
import { getCourseRatings } from "@/api/tutorApi";
import { listUnlistCourse } from "../../api/tutorApi";
import { Snackbar, Alert } from "@mui/material";
import { Course } from "@/interfaces/interface";
import { Category } from "@/interfaces/interface";




const TutorMyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [ratings, setRatings] = useState<{ [key: string]: { average: number; count: number } }>({})
  const [sortOption,setSortOption] = useState<string>("default")
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const [count,setCount] = useState<{[key:string]:number}>({})
    const [totalCourses,setTotalCourses] = useState(0)
  


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const queryParams = new URLSearchParams({
          search:searchQuery,
          category:selectedCategory,
          sort:sortOption,
          page:page.toString(),
          limit:rowsPerPage.toString()
        }).toString();

        const courseResponse = await fetchTutorCourses(queryParams);
        setCourses(courseResponse.courses);
        setTotalCourses(courseResponse.total)
      } catch (error) {
        console.error("Failed to fetch  courses:", error);
      }
    };

     const fetchCategories = async()=>{
          try {
            const categories = await getCategories()
            const categoryResponse = categories.filter((category:Category)=>category.isListed===true)
            setCategories(categoryResponse)
          } catch (error) {
            console.error("Failed to fetch categories:", error);
            
          }
        }
    fetchCourses();
    fetchCategories()
  }, [searchQuery,selectedCategory,sortOption,page]);

  const totalPages = Math.ceil(totalCourses/rowsPerPage)

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


  useEffect(()=>{
    const fetchEnrollmentCount = async()=>{
      try {
        const counts: { [key: string]: number } = {};

        for (const course of courses){
          const count = await getEnrollmentCount(course._id)
          counts[course._id] = count; 
        }
        setCount(counts)

      } catch (error) {
        console.error("failed to load enrollment count") 
      }
    }
    if (courses.length>0){
      fetchEnrollmentCount()
    }
  },[courses])
  


  const handleListUnlistCourse = async (courseId: string, isCurrentlyListed: boolean) => {
    try {
      const response = await listUnlistCourse(courseId, isCurrentlyListed);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, isListed: !isCurrentlyListed } : course))
      setSnackbarMessage(`Course ${!isCurrentlyListed ? "listed" : "unlisted"} successfully`);
      setSnackbarOpen(true);

    } catch (error) {
      console.error("Error listing or unlisting course:", error);
      setSnackbarMessage("Failed to update listing status!");
      setSnackbarOpen(true);

    }
  }

  // const filteredCourses = courses.filter((course) => {
  //   const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesCategory = selectedCategory === "all" || course.categoryId._id === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });

  
  // const sortedCourses = [...filteredCourses].sort((a,b)=>{
  //   if(sortOption==="priceAsc") return a.price- b.price;
  //   if(sortOption==="priceDesc") return b.price-a.price;
  //   if(sortOption==="ratingAsc") return (ratings[a._id]?.average || 0)-(ratings[b._id]?.average || 0);
  //   if(sortOption==="ratingDesc") return (ratings[b._id]?.average || 0)-(ratings[a._id]?.average || 0);

  //   return 0;
  // }) 

  // const totalPages = Math.ceil(sortedCourses.length / rowsPerPage);
  // const paginatedCourses = sortedCourses.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* Main content takes up remaining space */}
      <Container sx={{ mt: 15, mb: 20, flexGrow: 1 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          My Courses
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
          {courses.length > 0 ? (
            courses.map((course) => (
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
                    <br />
                    
                    <Typography variant="body2" color="text.secondary">
                      Status : {" "}
                      <span style={{ color: course.status === "approved" ? "green" : course.status === "rejected" ? "red" : "inherit" }}>
                        {course.status}
                      </span>
                    </Typography>

                    {course.status === "rejected" && course.rejectReason && (
                      <Typography variant="body2" color="text.secondary">
                        Reject Reason : <span style={{ color: "red" }}>{course.rejectReason}</span>
                      </Typography>
                    )}

                      <Typography variant="body2" sx={{ display: "flex", mt: 1 }}>
                        ⭐{ratings[course._id]?.average?.toFixed(1) || "N/A"}
                        ({ratings[course._id]?.count || 0} reviews)
                      </Typography>
                    {course.status === "approved" && (
                      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {course.isListed ? "Listed" : "Unlisted"}
                        </Typography>
                        <Switch
                          checked={course.isListed}
                          onChange={() => handleListUnlistCourse(course._id, course.isListed)}
                        />
                      </Box>
                    )}
                    <Typography variant="body2" sx={{ display: "flex", mt: 1 }}>
                      Number of students enrolled : {count[course._id]??0}
                    </Typography>

                    <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "#550A8A" }} onClick={() => navigate(`/tutor/myCourses/${course._id}`)} >
                      View course
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
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>;

    </Box>
  );
};

export default TutorMyCourses;
