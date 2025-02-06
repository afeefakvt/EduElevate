import { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Toolbar, Card, CardContent, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import Navbar from './AdminNavbar';
import Sidebar from './Sidebar';
import { getTutorDetails,approveTutor,rejectTutor } from '../../api/adminApi';

interface TutorDetails {
    name: string,
    email: string,
    title: string,
    bio: string,    
    status: string
}

const TutorDetails = () => {
    const { tutorId } = useParams<{ tutorId: string }>();
    const [tutor, setTutor] = useState<TutorDetails | null>(null);
    const navbarHeight = { xs: '64px', md: '80px' };
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading,setActionLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchTutorDetails = async () => {
            if (tutorId) {
                setLoading(true);
            try {
                const response = await getTutorDetails(tutorId)
                // console.log('API Responseeeee:', response.data);
                setTutor(response.tutor);
            } catch (error) {
                console.error('Failed to fetch tutor details:', error);
            } finally {
                setLoading(false);
            }
        }
        };
        fetchTutorDetails()
    }, [tutorId]);

    const handleApprove = async()=>{
        if (!tutorId) return;
        setActionLoading(true);
        try {
            const updatedStatus = await approveTutor(tutorId)
            setTutor((prev)=>prev?{ ...prev,status:updatedStatus.status }:prev)
            
        } catch (error) {
            console.error('Failed to approve tutor:', error);
            
        }finally{
            setActionLoading(false);
        }

    }
    const handleReject = async()=>{
        if (!tutorId) return;
        setActionLoading(true)
        try {
            const updateStatus = await rejectTutor(tutorId)
            setTutor((prev)=>prev?{...prev,status:updateStatus.status}:prev)
        } catch (error) {
            console.error('Failed to reject tutor:', error);
            
        }finally{
            setActionLoading(false)
        }

    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ display: 'flex', marginTop: navbarHeight }}>
                <Sidebar />
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                                    {tutor?.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                                    {tutor?.email}
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            Title:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                            {tutor?.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            Bio:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                            {tutor?.bio}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            Status:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                            {tutor?.status}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        disabled={tutor?.status === 'approved' || tutor?.status === 'rejected' || actionLoading}
                                        sx={{ mr: 2 }}
                                        onClick={handleApprove}

                                    >
                                         {actionLoading && tutor?.status !== 'approved' ? 'Approving...' : 'Approve'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        disabled={tutor?.status === 'approved' || tutor?.status === 'rejected' || actionLoading}
                                        onClick={handleReject}
                                    >
                                     {actionLoading && tutor?.status !== 'rejected' ? 'Rejecting...' : 'Reject'}

                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default TutorDetails;
