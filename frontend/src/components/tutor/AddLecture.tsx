// import { useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "../common/Footer";
// import {
//     Container,
//     Typography,
//     TextField,
//     Button,
//     Box,
//     List,
//     ListItem,
//     ListItemText,
// } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// const AddLecture = () => {


//     const [lectures, setLectures] = useState<{ title: string; video: File | null }[]>([]);
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [order, setOrder] = useState('');
//     const [duration, setDuration] = useState('');
//     const [selectedFile, setSelectedFile] = useState<File | null>(null)

//     const handleAddLecture = () => {
//         if (title && description && order && duration && selectedFile) {
//             setLectures([...lectures, { title: title,description video: selectedFile }]);
//             setLectureTitle('');
//             setSelectedFile(null);
//         }
//     }


//     const handleRemoveLecture = (index: number) => {
//         const updatedLectures = lectures.filter((_, i) => i !== index);
//         setLectures(updatedLectures);
//       };



//     // const handlePublishCourse = async () => {
//     //     if (lectures.length === 0) {
//     //       alert("Please add at least one lecture before publishing.");
//     //       return;
//     //     }
      
//     //     const courseData = {
//     //       title: "Sample Course", // Replace with actual course title input
//     //       lectures: lectures.map(lecture => ({
//     //         title: lecture.title,
//     //         videoName: lecture.video?.name, // Only storing video name, upload handling needed
//     //       })),
//     //     };
      
//     //     try {
//     //       const response = await fetch("http://localhost:5000/api/courses", {
//     //         method: "POST",
//     //         headers: { "Content-Type": "application/json" },
//     //         body: JSON.stringify(courseData),
//     //       });
      
//     //       if (response.ok) {
//     //         alert("Course Published Successfully!");
//     //         setLectures([]); // Clear lectures after publishing
//     //       } else {
//     //         alert("Failed to publish course");
//     //       }
//     //     } catch (error) {
//     //       console.error("Error publishing course:", error);
//     //       alert("An error occurred while publishing the course");
//     //     }
//     //   };


//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 minHeight: "100vh",
//             }}
//         >
//             <Navbar />

//             <Container
//                 maxWidth="md"
//                 sx={{
//                     flexGrow: 1,
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     py: 15,
//                 }}
//             >
//                 <Typography variant="h4" sx={{ my: 3, fontWeight: 650 }}>
//                     Add Lectures
//                 </Typography>

//                 <Box sx={{ width: "100%" }}>
//                     <TextField
//                         label="Lecture Title"
//                         value={lectureTitle}
//                         onChange={(e) => setLectureTitle(e.target.value)}
//                         fullWidth
//                         required
//                     />
//                     <TextField
//                         label="Lecture Description"
//                         value={lectureTitle}
//                         onChange={(e) => setLectureTitle(e.target.value)}
//                         fullWidth
//                         required
//                     />
//                     <TextField
//                         label="Lecture Order"
//                         value={lectureTitle}
//                         onChange={(e) => setLectureTitle(e.target.value)}
//                         fullWidth
//                         required
//                     />
//                     <TextField
//                         label="Lecture Duration"
//                         value={lectureTitle}
//                         onChange={(e) => setLectureTitle(e.target.value)}
//                         fullWidth
//                         required
//                     />
//                     <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
//                         <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: "#6A0DAD" }}>
//                             Upload Lecture Video
//                             <input
//                                 type="file"
//                                 accept="video/*"
//                                 hidden
//                                 onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                             />
//                         </Button>
//                     </Box>

//                     {selectedFile && <Typography>Selected File: {selectedFile.name}</Typography>}

//                     <Button
//                         variant="contained"
//                         fullWidth
//                         sx={{ mt: 2, backgroundColor: "#6A0DAD" }}
//                         onClick={handleAddLecture}
//                         disabled={!lectureTitle || !selectedFile}
//                     >
//                         Add Lecture
//                     </Button>
//                 </Box>

//                 {lectures.length > 0 && (
//                     <Box sx={{ mt: 4, width: "100%" }}>
//                         <Typography variant="h6">Lecture List</Typography>
//                         <List>
//                             {lectures.map((lecture, index) => (
//                                 <ListItem key={index}>
//                                     <ListItemText primary={lecture.title} secondary={lecture.video?.name} />
//                                     <Button
//                                         variant="contained"
//                                         color="error"
//                                         onClick={() => handleRemoveLecture(index)}
//                                     >
//                                         X
//                                     </Button>
//                                 </ListItem>
//                             ))}
//                         </List>
//                     </Box>
//                 )}
//                 {lectures.length > 0 && (
//                     <Button
//                         variant="contained"
//                         fullWidth
//                         sx={{ mt: 3,  backgroundColor: "#6A0DAD"  }}
//                     // onClick={handlePublishCourse}
//                     >
//                         Publish Course
//                     </Button>
//                 )}
//             </Container>

//             <Footer />
//         </Box>
//     );
// }

// export default AddLecture