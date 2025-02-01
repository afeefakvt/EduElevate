// import { useEffect, useState } from 'react';
// import { Box, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography } from '@mui/material';
// import Navbar from './AdminNavbar';
// import Sidebar from './Sidebar';
// import { axiosInstance } from '../../api/axiosInstance'; 
// import { useNavigate } from 'react-router-dom';

// interface Tutor {
//   _id: string; 
//   name: string;
//   email: string;
//   status: string;
//   isBlocked:boolean;
// }

// const Tutors = () => {
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const navbarHeight = { xs: '64px', md: '80px' };
//   const navigate= useNavigate()

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         const response = await axiosInstance.get('/admin/tutors'); 
//         console.log('API Response:', response.data);
//         setTutors(response.data.tutors);
//       } catch (error) {
//         console.error('Failed to fetch tutors:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTutors();
//   }, []);

//   const viewDetails = (tutorId:string)=>{
//     navigate(`/admin/tutors/${tutorId}`)
//   }


//   const toggleBlockStatus = async(tutorId:string,isCurrentlyBlocked:boolean)=>{
//     try {
//       const response = await axiosInstance.patch(`/admin/tutors/${tutorId}/update`,{
//         isBlocked:!isCurrentlyBlocked,  // Toggle the current status
//       });

//       setTutors((prevTutors)=>{
//         return prevTutors.map((tutor) => tutor._id == tutorId ? { ...tutor, isBlocked: !isCurrentlyBlocked } : tutor);
//       })
//       console.log(response.data.message || 'Tutor status updated');
//     } catch (error) {
//       console.error('Failed to update tutor status:', error); 

//     }

//   }

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//       <Navbar />
//       <Box sx={{ display: 'flex', marginTop: navbarHeight }}>
//         <Sidebar />
//         <Box sx={{ flexGrow: 1, p: 3 }}>
//           <Toolbar />
//           <Typography variant="h4" gutterBottom>
//             Tutors
//           </Typography>

//           {loading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Email</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {tutors.map((tutor) => (
//                     <TableRow key={tutor._id}>
//                       <TableCell>{tutor.name}</TableCell>
//                       <TableCell>{tutor.email}</TableCell>
//                       <TableCell>{tutor.status}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color={tutor.isBlocked ? 'success' : 'error'}
//                           onClick={() => toggleBlockStatus(tutor._id, tutor.isBlocked)}

//                         >
//                           {tutor.isBlocked ? 'Unblock' : 'Block'}
//                         </Button>
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           onClick={()=>viewDetails(tutor._id)}
//                         >
//                           View
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

// export default Tutors;




"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"; // ShadCN input field
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";




interface Tutor {
  _id: string;
  name: string;
  email: string;
  status: string;
  isBlocked: boolean;
}

export default function Tutors() {


  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const tutorsPerPage = 5;
  const navbarHeight = { xs: '64px', md: '80px' };
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axiosInstance.get('/admin/tutors');
        console.log('API Response:', response.data);
        setTutors(response.data.tutors);
      } catch (error) {
        console.error('Failed to fetch tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const viewDetails = (tutorId: string) => {
    navigate(`/admin/tutors/${tutorId}`)
  }


  const toggleBlockStatus = async (tutorId: string, isCurrentlyBlocked: boolean) => {
    try {
      const response = await axiosInstance.patch(`/admin/tutors/${tutorId}/update`, {
        isBlocked: !isCurrentlyBlocked,  // Toggle the current status
      });

      setTutors((prevTutors) => {
        return prevTutors.map((tutor) => tutor._id == tutorId ? { ...tutor, isBlocked: !isCurrentlyBlocked } : tutor);
      })
      console.log(response.data.message || 'Tutor status updated');
    } catch (error) {
      console.error('Failed to update tutor status:', error);

    }

  }
  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = filteredTutors.slice(indexOfFirstTutor, indexOfLastTutor);
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);

  // // Define table columns
  // const columns: ColumnDef<Tutor>[] = [
  //   {
  //     accessorKey: "name",
  //     header: "Tutor Name",
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Tutor Email",
  //   },

  //   {
  //     accessorKey: "isBlocked",
  //     header: "Blocked",
  //     cell: ({ row }) => (
  //       <Switch
  //         checked={row.original.isBlocked}
  //         onCheckedChange={() => toggleBlockStatus(row.original._id, row.original.isBlocked)}
  //       />
  //     ),
  //   },
  //   {
  //     header: "Actions",
  //     cell: ({ row }) => (
  //       <Button
  //         variant="outline"
  //         onClick={() => viewDetails(row.original._id)}
  //       >
  //         View
  //       </Button>
  //     ),
  //   },
  // ];

  return (
    <div className="relative min-h-screen">
      {/* Navbar */}
      <AdminNavbar />
      <div>
        <Sidebar />
      </div>
      <div className="container mx-auto mt-5 p-4" style={{ paddingTop: "150px", width: "1100px", marginLeft: "350px" }} >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manage Tutors</h1>
            {/* Search Input */}
            <Input
            type="text"
            placeholder="Search Tutors..."
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
                  <TableHead>Tutor Name</TableHead>
                  <TableHead>Tutor Email</TableHead>
                  <TableHead>Blocked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTutors.map((tutor) => (
                  <TableRow key={tutor._id}>
                    <TableCell>{tutor.name}</TableCell>
                    <TableCell>{tutor.email}</TableCell>
                    <TableCell>
                      <Switch
                        checked={tutor.isBlocked}
                        onCheckedChange={() => toggleBlockStatus(tutor._id, tutor.isBlocked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => viewDetails(tutor._id)} size="sm">View</Button>
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

