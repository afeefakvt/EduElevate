
"use client";

import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { getStudents, studentBlockUnblock } from "../../api/adminApi";
import { IStudent } from "@/interfaces/interface";



export default function Students() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); 
  const studentsPerPage = 5;
  



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
      await studentBlockUnblock(studentId,isCurrentlyBlocked)

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
    {/* <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        action={selectedStudent?.action || ""}
      /> */}
    </div>

  );
}