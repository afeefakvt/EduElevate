"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { getCourseApplications } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  title: string;
  tutorId: {_id:string; name:string}
  categoryId: {_id:string; name:string}
  price: number;
  duration:string;
  status:string;
  isRequestedToEdit:Boolean;

}

export default function CourseApplications() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const coursesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourseApplications();
        // console.log("API Response:", response);
        const filteredCourses = response.filter((course:Course)=>course.status==="pending" )
        setCourses(filteredCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses ? courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.tutorId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.categoryId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const viewDetails = (courseId:string)=>{
    navigate(`/admin/courseApplications/${courseId}`)
  }


  return (
    <div className="relative min-h-screen">
      <AdminNavbar />
      <Sidebar />
      <div className="container mx-auto mt-5 p-4" style={{ paddingTop: "150px", width: "1100px", marginLeft: "350px" }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Course Applications</h1>
          <Input
            type="text"
            placeholder="Search Courses..."
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
                  <TableHead>Course Title</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCourses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.tutorId?.name}</TableCell>
                    <TableCell>{course.categoryId?.name}</TableCell>
                    <TableCell>₹{course.price}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    {/* <TableCell>
                      
                      <Button disabled={course?.status==="approved" || course?.status==="pending"} onClick={() => approveCourse(course._id)} size="sm" style={{marginRight:"3px"}}>Approve</Button>
                      <Button disabled={course?.status==="approved" || course?.status==="pending"} onClick={() => rejectCourse(course._id)} size="sm">Reject</Button>
                    </TableCell> */}
                    <TableCell>
                      <Button onClick={() => viewDetails(course._id)} size="sm">View</Button>
                    </TableCell>                  
                    </TableRow>
                ))}
              </TableBody>
            </Table>

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
