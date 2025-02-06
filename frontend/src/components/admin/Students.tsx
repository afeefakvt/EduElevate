// import  { useEffect, useState } from 'react';
// import { Box, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress,Typography,TextField } from '@mui/material';
// import Navbar from './AdminNavbar';
// import Sidebar from './Sidebar';
// import axios from 'axios';
// import { axiosInstance } from '../../api/axiosInstance';

// interface Student {
//   _id: string; 
//   name: string;
//   email: string;
//   isBlocked: boolean;
// }

// const Students = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchQuery, setSearchQuery] = useState<string>(''); 
//   const navbarHeight = { xs: '64px', md: '80px' };

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axiosInstance.get('/admin/students');
//         console.log('API Response:', response.data); 
//         setStudents(response.data.students);
//       } catch (error) {
//         console.error('Failed to fetch students:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);


//   // Handle block/unblock toggle
//   const handleBlockToggle = async (studentId: string, isCurrentlyBlocked: boolean) => {
//     try {
//       const response = await axiosInstance.patch(`/admin/students/${studentId}/update`, { isBlocked: !isCurrentlyBlocked });

//         setStudents((prevStudents) =>
//           prevStudents.map((student) =>
//             student._id === studentId ? { ...student, isBlocked: !isCurrentlyBlocked } : student
//           )
//         );
      
//     } catch (error) {
//       console.error('Failed to update student status:', error);
//     }
//   };

//   const filteredStudents = students.filter((student) =>
//     student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     student.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//       <Navbar />
//       <Box sx={{ display: 'flex', marginTop: navbarHeight }}>
//         <Sidebar />
//         <Box sx={{ flexGrow: 1, p: 3 }}>
//           <Toolbar />
//           <Typography variant="h4" gutterBottom >
//             Students
//           </Typography>
//           <Box sx={{ display: 'flex', marginBottom: 2 }}>
//             <TextField
//               label="Search by name or email"
//               variant="outlined"
//               fullWidth
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </Box>
//           {loading ? (
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '100%',
//               }}
//             >
//               <CircularProgress />
//             </Box>
//           ) : (
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Email</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredStudents.map((student) => (
//                     <TableRow key={student._id}>
//                       <TableCell>{student.name}</TableCell>
//                       <TableCell>{student.email}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color={student.isBlocked ? 'success' : 'error'}
//                           onClick={() => handleBlockToggle(student._id, student.isBlocked)}
//                         >
//                           {student.isBlocked ? 'Unblock' : 'Block'}
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Students;


"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN input field
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { getStudents, studentBlockUnblock } from "../../api/adminApi";

interface Student {
  _id: string; 
  name: string;
  email: string;
  isBlocked: boolean;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); 
  const studentsPerPage = 5;
  const navbarHeight = { xs: '64px', md: '80px' };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents()
        // console.log('API Response:', response.students); 
        setStudents(response.students);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); 


  const handleBlockToggle = async (studentId: string, isCurrentlyBlocked: boolean) => {
    try {
      const response = await studentBlockUnblock(studentId,isCurrentlyBlocked)

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId ? { ...student, isBlocked: !isCurrentlyBlocked } : student
          )
        );
      
    } catch (error) {
      console.error('Failed to update student status:', error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudent = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);


  
  return (
    <div className="relative min-h-screen">
    {/* Navbar */}
    <AdminNavbar />
    <div >
      <Sidebar />
    </div>
    <div className="container mx-auto  mt-5 p-4" style={{ paddingTop: "150px",width:"1100px", marginLeft:"350px" }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Students</h1>
        {/* Search Input */}
        <Input
            type="text"
            placeholder="Search Students..."
            className="w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>
      {loading ? <p>Loading...</p> : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                  <TableHead>Blocked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStudent.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Switch
                        checked={student.isBlocked}
                        onCheckedChange={() => handleBlockToggle(student._id, student.isBlocked)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <Button variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}      
    </div>
    </div>

  );
}