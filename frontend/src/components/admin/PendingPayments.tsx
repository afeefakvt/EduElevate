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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import { getPendingPayments, updatePaymentStatus } from "@/api/paymentApi";
import { useEffect, useState } from "react";
import { Payment } from "../../interfaces/interface";

const PendingPayments = () => {
  const [paymentsPending, setPaymentsPending] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const paymentsPerPage = 5;

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const data = await getPendingPayments();
        console.log(data);
        setPaymentsPending(data);
      } catch (error) {
        console.error("Error fetching pending payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingPayments();
  }, []);

  const handleSettlePayment = async (paymentId: string) => {
    setSelectedPayment(paymentId);
    setIsModalOpen(true);
  };

  const handleConfirmSettlement = async () => {
    if (selectedPayment) {
      try {
        await updatePaymentStatus(selectedPayment);
        setIsModalOpen(false);
        setPaymentsPending((prev) =>
          prev.filter((payment) => selectedPayment !== payment._id)
        );
      } catch (error) {
        console.log("Error settling payment", error);
      }
    }
  };

  const handleCancelSettlement = async () => {
    setIsModalOpen(false);
  };

  const filteredPayments = paymentsPending.filter(
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
          <h1 className="text-2xl font-bold">Pending Payments</h1>
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search Tutors..."
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
                  <TableHead>Name of Tutor</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>New Enrollments</TableHead>
                  <TableHead>Course Price</TableHead>
                  <TableHead>Amount Payable</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPayments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.tutorId.name}</TableCell>
                    <TableCell>{payment.courseId.title}</TableCell>
                    <TableCell>{payment.newEnrollments}</TableCell>
                    <TableCell>₹{payment.courseId.price}</TableCell>
                    <TableCell>₹{payment.settlementPrice}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSettlePayment(payment._id)}
                        size="sm"
                      >
                        Settle Payment
                      </Button>
                    </TableCell>
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>

          <p className="text-center mt-2">
            Are you sure you want to settle this payment?
          </p>

          <div className="flex justify-between mt-4">
            <Button
              onClick={handleCancelSettlement}
              variant="outline"
              className="w-1/2 mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSettlement} className="w-1/2">
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingPayments;
