import { approvedCount, pendingCount } from "@/api/tutorApi";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchTutorEnrollments } from "@/api/tutorApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { tutorRevenue } from "@/api/tutorApi";

interface Course {
  id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
}

const Banner2 = () => {
  const [approvedCourses, setApprovedCourses] = useState(0);
  const [pendingCourses, setPendingCourses] = useState(0);
  const [studentsEnrolled, setStudentsEnrolled] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const tutorId = useSelector(
    (state: RootState) => state.tutorAuth?.tutor?._id
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tutorId) {
          const approved = await approvedCount(tutorId);
          setApprovedCourses(approved);

          const pending = await pendingCount(tutorId);
          setPendingCourses(pending);

          const revenueSum = await tutorRevenue(tutorId);
          // console.log(revenueSum,"summm");
          setTotalRevenue(revenueSum.toFixed(2));
        }
        const enrollments = await fetchTutorEnrollments();
        const totalStudents = Object.values(
          enrollments as Record<string, number>
        ).reduce((sum, count) => sum + count, 0);

        setStudentsEnrolled(totalStudents);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const details = [
    { name: "Total Revenue", value: `₹${totalRevenue}` },
    { name: "Active Courses", value: approvedCourses ?? 0 },
    { name: "Pending Courses", value: pendingCourses ?? 0 },
    { name: "Students Enrolled", value: studentsEnrolled ?? 0 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        bgcolor: "#f5f5f5",
        padding: { xs: "2rem 1rem", md: "4rem" },
        // padding: "3rem 1rem",
        width: "100vw",
        alignItems: "center",
      }}
    >
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5rem",
          }}
        >
          {details.map((detail, index) => (
            <Card
              key={index}
              sx={{
                width: "250px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "500", color: "#333" }}
                >
                  {detail.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "700", marginTop: "0.5rem" }}
                >
                  {detail.value}
                </Typography>
                {/* <CardMedia sx={{ marginBottom: "1rem" }}>{category.icon}</CardMedia> */}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Banner2;
