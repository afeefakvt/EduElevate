import React from 'react';
import { Box, Typography, Grid, Button, Paper } from '@mui/material';
import AdminNavbar from './AdminNavbar';
import Sidebar from './Sidebar';

const Students = () => {
  // Sample student data
  const students = [
    { name: 'Children Toy', email: 'ChildrenTo@gmail.com', status: 'active' },
    { name: 'Makeup', email: 'makeup@example.com', status: 'blocked' },
    { name: 'Asus Laptop', email: 'asuslaptop@example.com', status: 'active' },
    { name: 'Iphone X', email: 'iphonex@example.com', status: 'active' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Sidebar */}
      <Box sx={{ width: '250px', backgroundColor: '#fff', boxShadow: 1 }}>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: 'calc(100% - 250px)', // Updated to use the full available width
        }}
      >
        {/* Navbar */}
        <Box sx={{ height: '64px', backgroundColor: '#fff', boxShadow: 1 }}>
          <AdminNavbar />
        </Box>

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            backgroundColor: '#f9f9f9',
            width:"1000px",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Students
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 2,
              width: '100%', // Adjust to occupy full width
              maxWidth: '1100px', // Add a max-width for large screens
              margin: '0 auto', // Center align the table
            }}
          >
            {/* Header Row */}
            <Grid
              container
              spacing={2}
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                py: 1,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <Grid item xs={12} md={4}>
                Name
              </Grid>
              <Grid item xs={12} md={4}>
                Email
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                Actions
              </Grid>
            </Grid>

            {/* Student Rows */}
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
              {students.map((student, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{
                    borderBottom: '1px solid #ddd',
                    py: 2,
                    alignItems: 'center',
                    textAlign: { xs: 'left', md: 'inherit' },
                  }}
                >
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">{student.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">{student.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                    {student.status === 'active' ? (
                      <Button variant="contained" color="error">
                        Block
                      </Button>
                    ) : (
                      <Button variant="contained" color="success">
                        Unblock
                      </Button>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Students;





// import React, { useState, useEffect } from "react";
// import { Box, Typography, Grid, Button, Paper } from "@mui/material";
// import axios from "axios";

// const Students = () => {
//   const [students, setStudents] = useState([]);

//   // Fetch students data from the backend
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/api/students");
//       setStudents(response.data); // Assuming response.data contains the student array
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }
//   };

//   // Handle block/unblock button click
//   const handleBlockUnblock = async (studentId, currentStatus) => {
//     try {
//       const newStatus = currentStatus === "active" ? "blocked" : "active";

//       await axios.put(`http://localhost:3000/api/students/${studentId}`, {
//         status: newStatus,
//       });

//       // Update the UI without refetching
//       setStudents((prevStudents) =>
//         prevStudents.map((student) =>
//           student._id === studentId
//             ? { ...student, status: newStatus }
//             : student
//         )
//       );
//     } catch (error) {
//       console.error("Error updating student status:", error);
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography
//         variant="h4"
//         gutterBottom
//         sx={{ fontWeight: "bold", textAlign: "center" }}
//       >
//         Students
//       </Typography>
//       <Paper elevation={3} sx={{ p: 3 }}>
//         {/* Header Row */}
//         <Grid
//           container
//           spacing={2}
//           sx={{
//             fontWeight: "bold",
//             backgroundColor: "#f5f5f5",
//             py: 1,
//             display: { xs: "none", md: "flex" },
//           }}
//         >
//           <Grid item xs={12} md={4}>
//             Name
//           </Grid>
//           <Grid item xs={12} md={4}>
//             Email
//           </Grid>
//           <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
//             Actions
//           </Grid>
//         </Grid>

//         {/* Student Rows */}
//         <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
//           {students.map((student) => (
//             <Grid
//               container
//               spacing={2}
//               key={student._id}
//               sx={{
//                 borderBottom: "1px solid #ddd",
//                 py: 2,
//                 alignItems: "center",
//                 textAlign: { xs: "left", md: "inherit" },
//               }}
//             >
//               <Grid item xs={12} md={4}>
//                 <Typography variant="body1">{student.name}</Typography>
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Typography variant="body1">{student.email}</Typography>
//               </Grid>
//               <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
//                 {student.status === "active" ? (
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleBlockUnblock(student._id, student.status)}
//                   >
//                     Block
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="contained"
//                     color="success"
//                     onClick={() => handleBlockUnblock(student._id, student.status)}
//                   >
//                     Unblock
//                   </Button>
//                 )}
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default Students;
