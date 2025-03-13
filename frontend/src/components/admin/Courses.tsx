  "use client";

  import { useEffect, useState } from "react";
  import AdminNavbar from "./AdminNavbar";
  import Sidebar from "./Sidebar";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input"; 
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
  import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
  import { getCourseApplications } from "../../api/adminApi"; 
  import { Course } from "@/interfaces/interface";

  export default function AdminCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const coursesPerPage = 5;

    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const response = await getCourseApplications(); 
          const filteredCourses = response.filter((course:Course)=>course.status!=="pending")
          setCourses(filteredCourses);
        } catch (error) {
          console.error("Failed to fetch courses:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tutorId.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    return (
      <div className="relative min-h-screen">
        <AdminNavbar />
        <Sidebar />
        <div className="container mx-auto mt-5 p-4" style={{ paddingTop: "150px", width: "1100px", marginLeft: "350px" }}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Courses</h1>
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
                    <TableHead>Course Name</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead>Total Ratings</TableHead>
                    <TableHead>Students Enrolled</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCourses.map((course) => (
                    <TableRow key={course?._id}>
                      <TableCell>{course?.title}</TableCell>
                      <TableCell>{course?.tutorId?.name}</TableCell>
                      <TableCell>{course?.categoryId?.name}</TableCell>
                      <TableCell>₹{course?.price}</TableCell>
                      <TableCell>{course?.status}</TableCell>
                      {/* <TableCell>{course?.totalRatings}</TableCell>
                      <TableCell>{course?.studentsEnrolled}</TableCell> */}
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
