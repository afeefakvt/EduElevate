import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { Payment } from "@/interfaces/interface";
  import { useSelector } from "react-redux";
  import { RootState } from "@/store/store";
  import { tutorAmount } from "@/api/tutorApi";
  import Navbar from "./Navbar";
  import Footer from "../common/Footer";
  
  const Payments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const tutor = useSelector((state: RootState) => state.tutorAuth.tutor);
    const tutorId = tutor?._id;
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
  
    useEffect(() => {
      const fetchTutorsPayment = async (tutorId: string) => {
        const data = await tutorAmount(tutorId);
        setPayments(data);
      };
      if (tutorId) {
        fetchTutorsPayment(tutorId);
      }
    }, []);
  
    const indexOfLastPayment = currentPage * rowsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - rowsPerPage;
    const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);
    const totalPages = Math.ceil(payments.length / rowsPerPage);
  
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          // backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box sx={{ flexGrow: 1, p: 8, mt: "64px" }}>
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: 20, md: 28 }, fontWeight: "bold" }}
            gutterBottom
          >
            Payments History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell>New Enrollments</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Receivable Amount</TableCell>
                  <TableCell>Received Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>  
              <TableBody>
                {currentPayments.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{payment.courseId?.title || "N/A"}</TableCell>
                    <TableCell>{payment.newEnrollments || 0}</TableCell>
                    <TableCell>{payment.courseId?.price || 0}</TableCell>
                    <TableCell>{payment.settlementPrice.toFixed(2) || 0}</TableCell>
                    <TableCell>
                      {payment.settlementDate
                        ? new Date(payment.settlementDate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      style={{
                        color: payment.settlementStatus === "pending" ? "orange" : "green",
                      }}
                    >
                      {payment.settlementStatus}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                sx={{ color: "#550A8A" }}
              />
            </Box>
          )}
        </Box>
        {/* <Footer /> */}
      </Box>
    );
  };
  
  export default Payments;
  