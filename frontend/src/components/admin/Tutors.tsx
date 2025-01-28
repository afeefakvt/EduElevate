import { useEffect, useState } from 'react';
import { Box, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography } from '@mui/material';
import Navbar from './AdminNavbar';
import Sidebar from './Sidebar';
import { axiosInstance } from '../../api/axiosInstance'; 
import { useNavigate } from 'react-router-dom';

interface Tutor {
  _id: string; 
  name: string;
  email: string;
  status: string;
  isBlocked:boolean;
}

const Tutors = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navbarHeight = { xs: '64px', md: '80px' };
  const navigate= useNavigate()

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

  const viewDetails = (tutorId:string)=>{
    navigate(`/admin/tutors/${tutorId}`)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ display: 'flex', marginTop: navbarHeight }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Typography variant="h4" gutterBottom>
            Tutors
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tutors.map((tutor) => (
                    <TableRow key={tutor._id}>
                      <TableCell>{tutor.name}</TableCell>
                      <TableCell>{tutor.email}</TableCell>
                      <TableCell>{tutor.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={tutor.isBlocked ? 'success' : 'error'}
                         
                        >
                          {tutor.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={()=>viewDetails(tutor._id)}
                        >
                          View
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

export default Tutors;


