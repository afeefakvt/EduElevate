import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { getCourseDetails, approveCourse, rejectCourse } from "../../api/adminApi";

interface Course {
  _id: string;
  title: string;
  description: string;
  status: string;
  lectures: { title: string; duration: string; description:string; videoUrl: string }[];
}

export default function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading,setActionLoading] = useState<boolean>(false)


  if (!courseId) {
    return <p>Invalid course ID</p>; 
  }
  useEffect(() => {
    const fetchCourse = async () => {
        if(courseId){
            setLoading(true)
        }
      try {
        const response = await getCourseDetails(courseId);
        setCourse(response.course);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);


  const handleApprove = async () => {
    if(!courseId) return;
    setActionLoading(true);
    try {
        const updatedStatus = await approveCourse(courseId);
        setCourse((prev)=>prev?{...prev,status:updatedStatus.status}:prev)
        
    } catch (error) {
        console.error("Failed to approve course:",error)
        
    }finally{
        setActionLoading(false)
    }
    
  };

  const handleReject = async()=>{
    if(!courseId) return;
    setActionLoading(true);
    try {
        const updatedStatus = await rejectCourse(courseId);
        setCourse((prev)=>prev?{...prev,status:updatedStatus.status}:prev)
    } catch (error) {
        console.error("Failed to reject course:",error)   
    }finally{
        setActionLoading(false)
    }
  }

  

  return (
    <div className="relative min-h-screen">
      <AdminNavbar />
      <Sidebar />
      <div className="container mx-auto mt-5 p-4" style={{ paddingTop: "150px", width: "1100px", marginLeft: "350px" }}>

        {loading?(
            <div className="flex justify-center items-center h-40">
            <p className="text-lg font-semibold">Loading course details...</p>
          </div>
        ): !course ?(
            <p className="text-red-500 text-lg font-semibold">Course not found.</p>
        ):(
            <>
            <h1 className="text-2xl font-bold mb-4">Course Details</h1>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Course Description</h2>
          <p className="mb-4">{course.description}</p>
          <div className="flex gap-2">
            <Button onClick={handleApprove} disabled={course.status !== "pending" || actionLoading} className="bg-green-500 hover:bg-green-600">
            {actionLoading && course?.status !== 'approved' ? 'Approving...' : 'Approve'}           
             </Button>
            <Button onClick={handleReject} disabled={course.status !== "pending" || actionLoading} className="bg-red-500 hover:bg-red-600">
            {actionLoading && course?.status !== 'rejected' ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-4">Course Lectures</h2>
          {course?.lectures?.map((video, index) => (
            <div key={index} className="mb-4 p-4 border rounded shadow bg-gray-100 flex items-center">
              <div className="w-1/4">
                <video width="100%" controls>
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* <video width="100%" controls>
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
</video> */}

              </div>
              <div className="ml-4">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="font-semibold"> {video.description}</p>
                <p className="text-sm">Duration: {video.duration}</p>
              </div>
            </div>
          ))}
        </div>  

            </>
        )}
        
      </div>
    </div>
  );
}
