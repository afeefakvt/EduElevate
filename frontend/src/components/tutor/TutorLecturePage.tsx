import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText, ButtonBase,} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { getCourseDetails } from "@/api/courseApi";





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



const TutorLecturePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null); 

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
    </Box>

  )
}

export default TutorLecturePage