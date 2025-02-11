import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For dynamic routing
import {  Container,
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
  Box,} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Navbar from "../common/Navbar"; 
import Footer from "../common/Footer"; 
import { getCourseDetails } from "@/api/courseApi";




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
  reviews:number;
  level:string;
  language:string
  createdAt:Date
}


const CourseDetails = () => {
  const { courseId } = useParams(); 
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);



    useEffect(()=>{
      const fetchCourse = async()=>{
        if(!courseId) return;

          setLoading(true)
        try {
          const response = await getCourseDetails(courseId);
          setCourse(response.course) 
        } catch (error) {
          console.error("Failed to fetch course details:", error);
        }finally{
          setLoading(false)
        }
      }
      fetchCourse()
    },[courseId])


  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 20,mb:25 }}>
        <Grid container spacing={4}>
          {loading?(
            <div className="flex justify-center items-center h-40">
            <p className="text-lg font-semibold">Loading course details...</p>
          </div>
          ):!course?(
            <p className="text-red-500 text-lg font-semibold">Course not found.</p>

          ):(
            <>
             {/* Left Side: Course Image & Info */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2, boxShadow: 3 }}>
              <CardMedia component="img"  sx={{ height: 200, width: "100%", objectFit: "contain" }}
               image={course.thumbnail} alt={course.title} />
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {course?.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                By <span style={{ color: "#550A8A" }}>{course.tutorId.name}</span> | Published on {new Date(course.createdAt).toLocaleDateString()} | Reviews
                </Typography>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {course.description}
              </Typography>
            </Box>

            {/* Course Requirements */}
            <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Requirements for this course
              </Typography>
              <List>
                  <ListItem >
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText  />
                  </ListItem>
              </List>
            </Box>
          </Grid>

          {/* Right Side: Course Pricing & Purchase */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, boxShadow: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#550A8A" }}>
                ₹{course.price}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Course Details */}
              <List>
                <ListItem>
                  <ListItemText primary={`⏳ Course Duration: ${course.duration}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`📚 Course Level: ${course.level}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`🗣 Language: ${course.language}`} />
                </ListItem>
              </List>

              {/* Purchase Buttons */}
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2,background:"#550A8A" }}>
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

            </>
          )}
          
         
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default CourseDetails;
