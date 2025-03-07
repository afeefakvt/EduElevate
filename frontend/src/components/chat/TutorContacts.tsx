import { Box, Typography, Avatar, styled, Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from '@/store/store';
import { MyStudent,IStudent } from '@/interfaces/interface';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { getMyStudents } from '@/api/tutorApi';
import Chat from './Chat';
import Navbar from "../tutor/Navbar";


const ChatContainer = styled(Box)({
    display: "flex",
    height: "100vh", // Full height of viewport
    marginTop: "83px", // Adjust for the navbar height
    overflow: "hidden", // Prevent overflow breaking
  });
  
  const ContactsList = styled(Box)(({ theme }) => ({
    width: "30%",
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflowY: "auto", // Make it scrollable
    height: "100vh", // Full height minus navbar
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      display: "block", // Responsive handling
    },
  }));
  
  const ContactItem = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isSelected",
  })<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    cursor: "pointer",
    backgroundColor: isSelected ? theme.palette.action.selected : "inherit",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }));
  
  const ContentArea = styled(Box)({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  });
  
  
  

const TutorContacts = () => {

    const [myStudents,setMyStudents] = useState<IStudent[]>([])
    const navigate = useNavigate()
    const {studentId} = useParams()
    const student = useSelector((state:RootState)=>state.auth.student)
    const tutor = useSelector((state:RootState)=>state.tutorAuth.tutor)
    const unreadCounts  = useUnreadMessages(tutor?._id ?? "")
    

    useEffect(()=>{
        const fetchMyStudents = async()=>{
            const students = await getMyStudents()
            console.log(students,);
            
            const uniqueStudents = Array.from(
                new Map(
                    students.map((entry:MyStudent)=>[
                        entry?.student?._id,
                        entry.student
                    ])
                ).values()
            ) as IStudent[]
            setMyStudents(uniqueStudents)
            console.log(myStudents,"ppppppppppp");
            
        }
        fetchMyStudents()
    },[]);

    const handleChatClick= (studentId:string)=>{
        navigate(`/tutor/contacts/${studentId}`)
    }
    return (
        <Box>
            <Navbar/>
            
        <ChatContainer >
        <ContactsList
          sx={{
            bgcolor: "#f2f2f2",
            display: { xs: studentId ? "none" : "block", md: "block" },
          }}
        >
          {/* <ContactsList sx={{ bgcolor: "#f2f2f2" }}> */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ textAlign: "center", ml: { xs: 3, md: 0 } }}
            >
              Your Students
            </Typography>
          </Box>
          <Box sx={{ overflow: "auto", height: "calc(100vh - 70px)" }}>
            {myStudents.length > 0 ? (
              myStudents.map((student, index) => (
                <ContactItem
                  key={index}
                  isSelected={studentId === student?._id}
                  onClick={() => student?._id && handleChatClick(student._id)}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar>{student?.name[0].toUpperCase()}</Avatar>
                    {student?._id && unreadCounts[student._id] > 0 && (
                      <Box>
                        <Badge
                          badgeContent={unreadCounts[student._id]}
                          color="primary"
                        />
                      </Box>
                    )}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">{student?.name}</Typography>
                      {/* <Typography variant="body2" color="text.secondary">
                        {student.courseId?.title}
                      </Typography> */}
                    </Box>
                  </Box>
                </ContactItem>
              ))
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  mt: 2,
                  fontSize: { xs: 14, md: "auto" },
                }}
                color="text.secondary"
              >
                No contacts found <br />
                You will see your students ones they enroll
              </Typography>
            )}
          </Box>
        </ContactsList>
  
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {studentId ? (
            <Chat />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                // backgroundImage: "url('/images/bgbbg.jpg')",
              }}
            >
              <Typography color="text.secondary">
                Select a student to start conversation
              </Typography>
            </Box>
          )}
        </Box>
      </ChatContainer>
      </Box>

  )
}

export default TutorContacts
