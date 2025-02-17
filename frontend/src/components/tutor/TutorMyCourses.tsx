import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getCategories } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { fetchTutorCourses } from "@/api/tutorApi";
import { getCourseRatings } from "@/api/ratingApi";
import Swal from "sweetalert2";
import { deleteTutorCourse } from "../../api/courseApi";
import { Snackbar, Alert } from "@mui/material";




interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  tutorId: {
    name: string;
  };
  price: number;
  description: string;
  status: string;
  rejectReason: string;
}







// interface Category {
//   _id: string;
//   name: string;
//   isListed: boolean;
// }

const TutorMyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate()
  // const [categories, setCategories] = useState<Category[]>([])
  // const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [ratings, setRatings] = useState<{ [key: string]: { average: number; count: number } }>({})
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");





  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseResponse = await fetchTutorCourses();
        const response = courseResponse.filter((course: Course) => course.status === "approved" || course.status === "rejected")
        console.log("repsonseeeeee")
        console.log("Fetched  courses:", response);

        setCourses(response);

        // const categoryResponse = await getCategories()
        // setCategories(categoryResponse.data.categories)
      } catch (error) {
        console.error("Failed to fetch  courses:", error);
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


  const handleDeletCourse = async(courseId:string)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "The course will be permannetly deleted. You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result)=>{
      if(result.isConfirmed){
        try {
          await deleteTutorCourse(courseId);
          setCourses(courses.filter((course)=>course._id !== courseId));
          setSnackbarMessage("Course deleted Successfully");
          setSnackbarOpen(true);
        } catch (error) {
          console.error("Error deleting course:", error);
          setSnackbarMessage("Failed to delete course!");
          setSnackbarOpen(true);
          
        }
      }
    })
  }


  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesCategory = selectedCategory === "all" || course.categoryId.name === selectedCategory;
    return matchesSearch
  });


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

                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      ⭐{ratings[course._id]?.average?.toFixed(1) || "N/A"}
                      ({ratings[course._id]?.count || 0} reviews)
                    </Typography>

                    <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "#550A8A" }} onClick={() => navigate(`/tutor/myCourses/${course._id}`)} >
                      View course
                    </Button>
                    <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "#550A8A" }} onClick={() => handleDeletCourse(course._id)} >
                      Delete course
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
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}  anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>;

    </Box>
  );
};

export default TutorMyCourses;
