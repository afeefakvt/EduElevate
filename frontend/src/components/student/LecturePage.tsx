import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText, ButtonBase, Modal, Rating, IconButton, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { getCourseDetails } from "@/api/courseApi";
import { addRatings } from "@/api/ratingApi";
import { Snackbar, Alert } from "@mui/material"; 




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
  title: string;
  tutorId: { _id: string; name: string }
  description: string;
  lectures: Lecture[]
}



const LecturePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState<string>("");
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();



  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const response = await getCourseDetails(courseId)
        setCourse(response.course);
        //  console.log(response.course,"ewaaaaaaaaaaa");

        if (response.course.lectures.length > 0) {
          setSelectedLecture(response.course.lectures[0]); //auto select first lecture
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);


      }
    }
    console.log("Fetching course details for ID:", courseId);

    fetchCourse()
  }, [courseId]);

  // const handleNavigate = ()=>{
  //   navigate('/myCourses')
  // }

  const handleSubmitRating = async (e:React.FormEvent) => {
    e.preventDefault()
    setRatingError(null);
    setReviewError(null);


    if (rating === null || rating === 0) {
      setRatingError("Please provide a rating.");
      return;
    }
    if (review.trim() === "") {
      setReviewError("Please provide a review.");
      return;
    }

    try {
      const response = await addRatings(courseId, rating, review)
      // console.log("Rating submitted successfully!");
      
      setOpenModal(false)
      setRating(0);
      setReview("");

      setSnackbarMessage("Rating and review submitted successfully!");
      setSnackbarOpen(true);

    } catch (error) {
      console.error("Error adding rating:", error);
      throw error;

    }


  }



  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container sx={{ mt: 16, mb: 30, flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}>
          <IconButton  sx={{ color: "#550A8A" }} onClick={()=>navigate('/myCourses')}>
            <ArrowBackIcon />
          </IconButton>
          <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ background: "#550A8A" }}>
            Rate this course
          </Button>
        </Box>
        {course ? (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {course.description}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              By <span style={{ color: "#550A8A" }}>{course.tutorId.name}</span>
            </Typography>
            <Box sx={{ display: "flex", gap: 3, mt: 4 }}>
              {/* Video Player */}
              <Box sx={{ flex: 2 }}>
                {selectedLecture ? (
                  <Card>
                    <Box sx={{ height: 400, overflow: "hidden" }}>
                      <iframe
                        width="100%"
                        height="100%"
                        src={selectedLecture.videoUrl}
                        title={selectedLecture.title}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedLecture.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {selectedLecture.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {selectedLecture.duration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lecture Order: {selectedLecture.order}
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Typography>No lectures available</Typography>
                )}
              </Box>

              {/* Lecture List */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Lecture List
                </Typography>
                <List sx={{ maxHeight: 400, overflowY: "auto", border: "1px solid #ddd", borderRadius: 2 }}>
                  {course.lectures.map((lecture) => (
                    <ListItem
                      key={lecture._id}
                      component="div" // Avoids type errors
                      sx={{
                        cursor: "pointer",
                        "&.Mui-selected": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <ButtonBase
                        sx={{ width: "100%", textAlign: "left", p: 1 }}
                        onClick={() => setSelectedLecture(lecture)}
                      >
                        <ListItemText primary={lecture.title} secondary={`Duration: ${lecture.duration}`} />
                      </ButtonBase>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </>
        ) : (
          <Typography variant="h6" color="text.secondary">Loading course details...</Typography>
        )}
      </Container>
      <Footer />

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Course rating and review
          </Typography>
          <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} />
          {ratingError && (
            <Typography color="error" variant="body2">
              {ratingError}
            </Typography>
          )}
          <TextField
            label="Comments"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            error={!!reviewError}
            helperText={reviewError}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 3, width: "100%", background: "#550A8A" }}
            onClick={handleSubmitRating}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000} // Hide after 3 seconds
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={() => setSnackbarOpen(false)} severity="success">
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </Box>

  )
}

export default LecturePage