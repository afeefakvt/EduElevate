import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "../common/Footer";
import { Stack } from "@mui/material";

import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import { addLecture } from "@/api/lectureApi";
import { validateAddLectureForm } from "@/utils/validations";


const AddLecture = () => {
    const [lectures, setLectures] = useState<{ title: string; description: string; order: number; duration: string; video: File | null }[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState('');
    const [duration, setDuration] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");
    const { courseId } = useParams()
    const navigate = useNavigate()

    const handleAddLecture = () => {

        const validationErrors = validateAddLectureForm({ title, description, order, duration, video: selectedFile });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

            setLectures([...lectures, { title, description, order: Number(order), duration: duration, video: selectedFile }]);
            setTitle('');
            setDescription('');
            setOrder('');
            setDuration('');
            setSelectedFile(null);
            setErrors({});
            setSnackbarMessage("Lecture added successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        
    }


    const handleRemoveLecture = (index: number) => {
        const updatedLectures = lectures.filter((_, i) => i !== index);
        setLectures(updatedLectures);
    };

    const handlePublishCourse = async () => {
        if (!courseId) {
            setSnackbarMessage("Course id is missing. Please go back.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }
        if (lectures.length === 0) {
            setSnackbarMessage("Please add at least one lecture before publishing.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const formData = new FormData()
        formData.append("lectures", JSON.stringify(lectures.map(({ title, description, order, duration }) => ({
            title, description, order, duration, courseId
        }))))

        lectures.forEach((lecture) => {
            if (lecture.video) {
                formData.append('videoFiles', lecture.video)
            }
        })
        try {
            
            await addLecture(courseId, formData)
            setLectures([])
            setSnackbarMessage("Your request for publishing course in EduElevate is under review. We will reach out to you within 24 hours.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate("/tutor/home");
            }, 5000);

        } catch (error) {
            console.error("Error publishing lectures", error);
            setSnackbarMessage("Error publishing lectures. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);

        }

    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Navbar />

            <Container
                maxWidth="md"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 15,
                }}
            >
                <Typography variant="h5" sx={{ my: 3, fontWeight: 650 }}>
                    Add Lectures
                </Typography>

                <Box sx={{ width: "100%" }}>
                    <Stack spacing={2} > 
                        <TextField label="Lecture Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required 
                              error={!!errors.title}
                              helperText={errors.title}/>
                        <TextField label="Lecture Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth required 
                              error={!!errors.description}
                              helperText={errors.description}/>
                        <TextField label="Lecture Order" value={order} onChange={(e) => setOrder(e.target.value)} fullWidth required 
                               error={!!errors.order}
                               helperText={errors.order}/>
                        <TextField label="Lecture Duration" value={duration} onChange={(e) => setDuration(e.target.value)} fullWidth required 
                                error={!!errors.duration}
                                helperText={errors.duration}/>
                    </Stack>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: "#6A0DAD" }}>
                            Upload Lecture Video
                            <input
                                type="file"
                                name="videoFiles"
                                accept="video/*"
                                hidden
                                onClick={(e) => (e.currentTarget.value = "")} 
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />
                        </Button>
                    </Box>

                    {selectedFile && <Typography>Selected File: {selectedFile.name}</Typography>}
                    {errors.video && <Typography color="error">{errors.video}</Typography>}


                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2, backgroundColor: "#6A0DAD" }}
                        onClick={handleAddLecture}
                        // disabled={!title || !description || !order || !duration || !selectedFile}
                    >
                        Add Lecture
                    </Button>
                </Box>

                {lectures.length > 0 && (
                    <Box sx={{ mt: 4, width: "100%" }}>
                        <Typography variant="h6">Lecture List</Typography>
                        <List>
                            {lectures.map((lecture, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={lecture.title} secondary={lecture.video?.name} />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleRemoveLecture(index)}
                                    >
                                        X
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {lectures.length > 0 && (
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, backgroundColor: "#6A0DAD" }}
                        onClick={handlePublishCourse}
                    >
                        Publish Course
                    </Button>
                )}
            </Container>
            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ backgroundColor: "black", color: "white" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Footer />
        </Box>
    )
}

export default AddLecture