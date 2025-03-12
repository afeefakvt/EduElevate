import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText, ButtonBase, IconButton, Menu, MenuItem, Modal, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../common/Footer";
import { getCourseDetails } from "@/api/tutorApi";
import { updateLecture } from "@/api/lectureApi";
import { validateEditLectureForm } from "@/utils/validations";
import { Snackbar, Alert } from "@mui/material";
import { listUnlistLecture } from "@/api/tutorApi";




interface Lecture {
  order: number;
  _id: string;
  title: string;
  videoUrl: string;
  description: string;
  duration: string;
  isListed: boolean;

}
interface Course {
  _id: string;
  title: string;
  tutorId: { _id: string; name: string }
  description: string;
  lectures: Lecture[]
}



const TutorLecturePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [editLecture, setEditLecture] = useState<Lecture>({
    _id: "",
    order: 0,  // Set a default value for order
    title: "",
    description: "",
    duration: "",
    videoUrl: "",
    isListed: true
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string; duration?: string }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");



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

  const handleListUnlistLecture = async (lectureId: string, isListed: boolean) => {
    try {
      const reponse = await listUnlistLecture(lectureId,isListed)

      setCourse((prevCourse) => {
        if (!prevCourse) return prevCourse;
        return {
          ...prevCourse,
          lectures: prevCourse.lectures.map((lecture) =>
            lecture._id === lectureId ? { ...lecture, isListed: !isListed } : lecture
          ),
        };
      });
      setSnackbarMessage(isListed ? "Lecture unlisted successfully!" : "Lecture listed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error("Error updating lecture status:", error);
      setSnackbarMessage("An error occurred while updating lecture status.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

    }
  }


  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, lecture: Lecture) => {
    setAnchorEl(event.currentTarget);
    setEditLecture(lecture);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleEditClick = () => {
    setOpenModal(true);
    setAnchorEl(null);
  };




  const handleSaveChanges = async () => {
    if (!editLecture || !editLecture._id) {
      setSnackbarMessage("Lecture data is incomplete.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    try {

      // console.log("before upsatinf",editLecture);
      const validationErrors = validateEditLectureForm({ ...editLecture, order: String(editLecture.order) });
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await updateLecture(editLecture._id, {
        title: editLecture.title,
        description: editLecture.description,
        duration: editLecture.duration,
        videoUrl: editLecture.videoUrl
      });

      if (response.success) {
        // Update the course state with the modified lecture
        setCourse((prevCourse) => {
          if (!prevCourse) return prevCourse;
          return {
            ...prevCourse,
            lectures: prevCourse.lectures.map((lecture) =>
              lecture._id === editLecture._id ? { ...lecture, ...editLecture } : lecture
            ),
          };
        });
        setOpenModal(false);
        setSnackbarMessage("Lecture updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);


      } else {
        setSnackbarMessage("Failed to update lecture.");
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
        console.error("Failed to update lecture:", response.message);
      }
    } catch (error) {
      console.error("Error updating lecture:", error);
      setSnackbarMessage("An error occurred while updating.");
      setSnackbarSeverity("error");
    }
  };



  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container sx={{ mt: 16, mb: 30, flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}>

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

                      {/* Menu Icon Button */}
                      <IconButton onClick={(e) => handleMenuClick(e, lecture)}>
                        <MoreVert />
                      </IconButton>
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
      {/* Menu Options */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditClick}>Edit Lecture</MenuItem>
        <MenuItem onClick={() => handleListUnlistLecture(editLecture?._id, editLecture?.isListed)}> {editLecture?.isListed ? "Unlist Lecture" : "List Lecture"}
        </MenuItem>
      </Menu>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: 400,
        }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Edit Lecture</Typography>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            value={editLecture?.title || ""}
            onChange={(e) => setEditLecture((prev) => ({ ...prev || {}, title: e.target.value }))}
            error={!!errors.title}
            helperText={errors.title} />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            value={editLecture?.description || ""}
            onChange={(e) => setEditLecture((prev) => ({ ...prev || {}, description: e.target.value }))}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            fullWidth
            label="Duration"
            margin="normal"
            value={editLecture?.duration || ""}
            onChange={(e) => setEditLecture((prev) => ({ ...prev || {}, duration: e.target.value }))}
            error={!!errors.duration}
            helperText={errors.duration}
          />
          <TextField
            fullWidth
            label="Video URL"
            margin="normal"
            value={editLecture?.videoUrl || ""}
            onChange={(e) => setEditLecture((prev) => ({ ...prev || {}, videoUrl: e.target.value }))}
          />
          <Button sx={{ mt: 2, background: "#550A8A" }} variant="contained" fullWidth onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>


    </Box>

  )
}

export default TutorLecturePage