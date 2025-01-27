import  { useEffect, useState } from 'react';
import { Box, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress,Typography,TextField } from '@mui/material';
import Navbar from './AdminNavbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import { axiosInstance } from '../../api/axiosInstance';

interface Student {
  id: string; 
  name: string;
  email: string;
  isBlocked: boolean;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const navbarHeight = { xs: '64px', md: '80px' };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('/admin/students');
        console.log('API Response:', response.data); 
        setStudents(response.data.students);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);


  // // Handle block/unblock toggle
  // const handleBlockToggle = async (id: string, isBlocked: boolean) => {
  //   try {
  //     const response = await axios.patch(`/api/students/${id}`, { isBlocked: !isBlocked }); // Replace with your API endpoint
  //     if (response.status === 200) {
  //       setStudents((prevStudents) =>
  //         prevStudents.map((student) =>
  //           student.id === id ? { ...student, isBlocked: !isBlocked } : student
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Failed to update student status:', error);
  //   }
  // };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ display: 'flex', marginTop: navbarHeight }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Typography variant="h4" gutterBottom >
            Students
          </Typography>
          <Box sx={{ display: 'flex', marginBottom: 2 }}>
            <TextField
              label="Search by name or email"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={student.isBlocked ? 'success' : 'error'}
                          // onClick={() => handleBlockToggle(student.id, student.isBlocked)}
                        >
                          {student.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Students;


