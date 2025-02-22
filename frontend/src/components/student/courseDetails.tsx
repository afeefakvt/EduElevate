import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getCourseDetails } from "@/api/courseApi";
import { RootState } from "@/store/store";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { axiosInstance } from "@/api/axiosInstance";
import { handleAxiosError } from "@/utils/errorHandler";
import { useLocation } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import contact from "../../assets/contact.jpeg"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Lecture {
  order: number;
  _id: string;
  title: string;
  videoUrl: string;
  description: string;
  duration: string;

}


interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  tutorId: { _id: string; name: string, email: string; title: string; bio: string; };
  categoryId: { _id: string; name: string };
  price: number;
  duration: string;
  status: string;
  reviews: number;
  level: string;
  language: string
  lectures: Lecture[];
  createdAt: Date
}


const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const student = useSelector((state: RootState) => state.auth.student)
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements();
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const isSuccess = searchParams.get("success") === "true"
  const isCancelled = searchParams.get("cancelled") === "true"
  const [openSnackbar, setOpenSnackbar] = useState(false)




  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      setLoading(true)
      try {
        const response = await getCourseDetails(courseId);
        setCourse(response.course)
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId]);


  useEffect(() => {
    if (isSuccess || isCancelled) {
      setOpenSnackbar(true)
    }
  }, [isSuccess, isCancelled])


  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (!stripe || !elements || !courseId || !course) return;


      console.log("courseId", courseId);

      const response = await axiosInstance.post(`/course/checkout/${courseId}`, { title: course?.title, price: course?.price });

      const { id: sessionId } = response.data

      const { error } = await stripe!.redirectToCheckout({
        sessionId
      })

      if (error) {
        console.log("Error redirecting to checkout page", error)
      }

    } catch (error) {
      console.error("checkout failed", error)
      throw handleAxiosError(error)

    } finally {
      setLoading(false)
    }

  }


  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 20, mb: 25 }}>
        <Grid container spacing={4}>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg font-semibold">Loading...</p>
            </div>
          ) : !course ? (
            <p className="text-red-500 text-lg font-semibold">Course not found.</p>

          ) : (
            <>
              {/* Left Side: Course Image & Info */}
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 2, boxShadow: 3 }}>
                  <CardMedia component="img" sx={{ height: 200, width: "100%", objectFit: "contain" }}
                    image={course.thumbnail} alt={course.title} />
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold">
                      {course?.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      By <span style={{ color: "#550A8A" }}>{course.tutorId.name}</span> | Published on {new Date(course.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>


                <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {course.description}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Course Content
                  </Typography>
                  <List>
                    {course.lectures.length > 0 ? (
                      course.lectures.map((lecture, index) => (
                        <Accordion key={index}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f5f5f5" }}>
                            <Typography variant="body1" fontWeight="bold">
                              {`${index + 1}. ${lecture.title}`}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" color="text.secondary">
                              {lecture.description}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                              Duration: {lecture.duration}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        No lectures available.
                      </Typography>
                    )}
                  </List>
                  </Box>

                <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    About the Instructor
                  </Typography>

                  <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 2, mt: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", mr: 2 }}
                      src={contact}
                      alt={course.tutorId.name}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {course.tutorId.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight="bold">
                        {course.tutorId.title}
                      </Typography>
                      <br />
                      <Typography variant="body2" color="text.secondary">
                        {course.tutorId.bio} with an innate ability to simplify complex topics,
                        I has been mentoring engineers beginning their careers in software development for years,
                        and has now expanded that experience onto EduElevate,
                        authoring the highest rated  course.
                        I teaches on EduElevate to share the knowledge I was gained with other software engineers.
                        Invest in yourself by learning from my published courses.
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#550A8A", mt: 1 }}>
                        📧 {course.tutorId.email || "Not Available"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                  <Box sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "white", boxShadow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Requirements for this course
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="You Will Need A Computer Running Linux, MacOS, Or Windows" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="A Basic Understanding Of Web Technologies" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Proficiency In A Programming Language Is Advantageous But Not Mandatory" />
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


                  {student ? (
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2, background: "#550A8A" }}
                      onClick={handleCheckout} disabled={!stripe || !elements}>
                      Enroll Now
                    </Button>

                  ) : (
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2, background: "#550A8A" }}
                      onClick={() => navigate('/login')} disabled={!stripe || !elements}>
                      Enroll Now
                    </Button>

                  )}

                  {/* <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
                Add to Wishlist
              </Button> */}

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      This course includes:
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary="✔️ Lifetime access" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="✔️ No refund policy" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="✔️ Free exercise files" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="✔️ Full time support" />
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
    </div>
  );
};

export default CourseDetails;
