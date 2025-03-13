import { Box, Typography, Avatar, styled, Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ITutor, MyTutor } from "@/interfaces/interface";
import { fetchEnrolledCourses } from "@/api/enrollmentApi";
import Chat from "./Chat";
import Navbar from "../common/Navbar";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";


const ChatContainer = styled(Box)({
  display: "flex",
  height: "100vh", 
  marginTop: "83px", // Adjust for the navbar height
  overflow: "hidden", // Prevent overflow breaking
});

const ContactsList = styled(Box)(({ theme }) => ({
  width: "25%",
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  overflowY: "hidden", 
  height: "100vh", 
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    display: "block", 
  },
}));

const ContactItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  borderRadius: "12px",
  border: `1px solid ${isSelected ? "#550A8A" : theme.palette.divider}`,
  cursor: "pointer",
  backgroundColor: isSelected ? "#550A8A" : "#fff",
  color: isSelected ? "#fff" : theme.palette.text.primary,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: isSelected ? "#550A8A" : "#f3e5f5",
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


const StudentContacts = () => {

  const [myTutors, setMyTutors] = useState<ITutor[]>([])
  const navigate = useNavigate()
  const { tutorId } = useParams()
  const student = useSelector((state: RootState) => state.auth.student)
  const unreadCounts = useUnreadMessages(student?._id ?? "")

  useEffect(() => {
    const getMyTutors = async () => {
      const tutorsName = await fetchEnrolledCourses();
      const uniqueTutors = Array.from(
        new Map(
          tutorsName.map((entry: MyTutor) => [
            entry?.courseId.tutorId._id,
            entry.courseId.tutorId
          ])
        ).values()
      ) as ITutor[]
      setMyTutors(uniqueTutors)
      // console.log(myTutors, "pppppppppppp");

    }
    getMyTutors()
  }, [])

  const handleChatClick = async (tutorId: string) => {
    navigate(`/messages/${tutorId}`)

    // Clear unread count for the selected tutor
    if (unreadCounts[tutorId] > 0) {
      await markMessagesAsRead(tutorId);
    }
  }

  const markMessagesAsRead = async (tutorId: string) => {
    unreadCounts[tutorId] = 0;
  };

  return (
    <Box>
      <Navbar/>
      <ChatContainer>
        <ContactsList sx={{ bgcolor: "#f2f2f2", display: { xs: tutorId ? "none" : "block", md: "block" } }}>

          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            }}
          >

            <Typography variant="h6" sx={{ ml: { xs: 3, md: 0 } }}>My Tutors</Typography>
          </Box>
          <Box sx={{ overflowY: "auto", height: "calc(100vh - 100px)" }}>
            {myTutors.length > 0 ? (myTutors.map((tutor, index) => (
              <ContactItem
                key={index}
                isSelected={tutorId === tutor._id}
                onClick={() => tutor._id && handleChatClick(tutor._id)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar>
                    {tutor.name ? tutor.name[0].toUpperCase() : "T"}
                  </Avatar>

                  {tutor._id && unreadCounts[tutor._id] > 0 && (
                    <Badge
                      badgeContent={unreadCounts[tutor._id]}
                      color="primary"
                    />
                  )}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1">{tutor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tutor.courseId?.title}
                    </Typography>
                  </Box>
                </Box>
              </ContactItem>
            ))) : (
              <Typography sx={{ textAlign: "center", mt: 2, fontSize: { xs: 14, md: "auto" } }} color="text.secondary">
                No contacts found <br />
                Enroll to a course to connect with your tutor
              </Typography>
            )}
          </Box>
        </ContactsList>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {tutorId ? (
            <Chat />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: { xs: 'none', md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f2f2f2",
              }}
            >
              <Typography color="text.secondary">
                Select a tutor to start converasation
              </Typography>
            </Box>
          )}
        </Box>

      </ChatContainer>
    </Box>
  )
}

export default StudentContacts




// import React, { useState } from "react";
// import { Box, Typography, Avatar, styled } from "@mui/material";

// const Container = styled(Box)({
//   display: "flex",
//   height: "100vh",
// });

// const ContactList = styled(Box)(({ theme }) => ({
//   width: "30%",
//   backgroundColor: "#f2f2f2",
//   borderRight: `1px solid ${theme.palette.divider}`,
//   overflowY: "auto",
//   padding: theme.spacing(2),
// }));

// const ContactItem = styled(Box)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
//   padding: theme.spacing(2),
//   borderBottom: `1px solid ${theme.palette.divider}`,
//   cursor: "pointer",
//   backgroundColor: isSelected ? theme.palette.action.selected : "inherit",
//   display: "flex",
//   alignItems: "center",
//   gap: theme.spacing(2),
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//   },
// }));

// const ChatArea = styled(Box)(({ theme }) => ({
//   flex: 1,
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: "#fff",
// }));

// const contacts = [
//   { id: "1", name: "John Doe" },
//   { id: "2", name: "Jane Smith" },
//   { id: "3", name: "Michael Johnson" },
// ];

// const ContactPage = () => {
//   const [selectedContact, setSelectedContact] = useState<string | null>(null);

//   const handleContactClick = (id: string) => {
//     setSelectedContact(id);
//   };

//   return (
//     <Container>
//       <ContactList>
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           Your Contacts
//         </Typography>
//         {contacts.map((contact) => (
//           <ContactItem
//             key={contact.id}
//             isSelected={selectedContact === contact.id}
//             onClick={() => handleContactClick(contact.id)}
//           >
//             <Avatar>{contact.name[0]}</Avatar>
//             <Typography>{contact.name}</Typography>
//           </ContactItem>
//         ))}
//       </ContactList>

//       <ChatArea>
//         {selectedContact ? (
//           <Typography variant="h5">Chat with {contacts.find((c) => c.id === selectedContact)?.name}</Typography>
//         ) : (
//           <Typography color="text.secondary">Select a contact to start conversation</Typography>
//         )}
//       </ChatArea>
//     </Container>
//   );
// };

// export default ContactPage;
