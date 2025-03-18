import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import { getPaymentHistory } from "@/api/paymentApi";
import { useEffect, useState } from "react";
import { Payment } from "../../interfaces/interface";

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const paymentsPerPage = 5;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const data = await getPaymentHistory();
        setPaymentHistory(data);
      } catch (error) {
        console.error("Error fetching  payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const filteredPayments = paymentHistory.filter(
    (payment) =>
      payment.tutorId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseId.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  return (
    <div className="relative min-h-screen">
      <AdminNavbar />
      <div>
        <Sidebar />
      </div>
      <div
        className="container mx-auto  mt-5 p-4"
        style={{ paddingTop: "150px", width: "1100px", marginLeft: "350px" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Payment History</h1>
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search Tutors or Courses..."
            className="w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>New Enrollments</TableHead>
                  <TableHead>Course Price</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>PaymentDate</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPayments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.tutorId.name}</TableCell>
                    <TableCell>{payment.courseId.title}</TableCell>
                    <TableCell>{payment.newEnrollments}</TableCell>
                    <TableCell>₹{payment.courseId.price}</TableCell>
                    <TableCell>₹{payment.settlementPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(payment.settlementDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </TableCell>
                    <TableCell
                      style={{
                        color:
                          payment.settlementStatus === "completed"
                            ? "green"
                            : "red",
                      }}
                    >
                      {payment.settlementStatus}
                    </TableCell>{" "}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <Button
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
