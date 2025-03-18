import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import NotFound from "./components/errors/NotFound";

import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import OtpPage from "./pages/OtpPage"
import Courses from "./components/student/Courses"
import CourseDetails from "./components/student/CourseDetails"
import StudentProtected from "./components/protectedRoutes/Studentprotected"
import MyCourses from "./components/student/MyCourses";
import LecturePage from "./components/student/LecturePage";
import Profile from "./components/common/Profile";
import StudentContacts from "./components/chat/StudentContacts";
import Chat from "./components/chat/Chat";


import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/AdminDashboard"
import Students from "./components/admin/Students"
import Tutors from "./components/admin/Tutors"
import TutorDetails from "./components/admin/TutorDetails"
import Category from "./components/admin/Category"
import AdminProtected from "./components/protectedRoutes/AdminProtected"
import AdminCourses from "./components/admin/Courses"
import CourseApplications from "./components/admin/CourseApplications"
import CourseDetailsAdmin from "./components/admin/CourseDetails"
import EditApplications from "./components/admin/EditApllications";
import EditCourseDetails from "./components/admin/EditCourseDetails";
import PendingPayments from "./components/admin/PendingPayments";
import PaymentHistory from "./components/admin/paymentHistory";


import TutorHome from "./components/tutor/tutorHome"
import TutorRegisterPage from "./components/tutor/RegisterPage"
import TutorOtp from "./components/tutor/Otp"
import TutorLoginPage from './components/tutor/LoginPage'
import AddCourse from "./components/tutor/AddCourse"
import AddLecture from "./components/tutor/AddLecture"
import TutorProtected from "./components/protectedRoutes/TutorProtected"
import TutorResetPassword from "./components/tutor/TutorResetPassword"
import TutorMyCourses from "./components/tutor/TutorMyCourses";
import TutorCourseDetails from "./components/tutor/TutorCourseDetails";
import EditCoursePage from "./components/tutor/EditCoursePage";
import TutorLecturePage from "./components/tutor/TutorLecturePage";
import TutorContacts from "./components/chat/TutorContacts";
import Payments from "./components/tutor/Payments";


import { ThemeProvider } from './components/ui/themeProvider'
import PasswordReset from "./components/common/PasswordReset"
import { useEffect } from "react";
import { socket } from "./utils/socket";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function App() {

  useEffect(() => {
    console.log("socket");
    
    socket.on("connect", () => {
      console.log(`socket connected to server with id: ${socket.id} `);

    })  
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    }

  }, []);

  return (
    <>
      <ThemeProvider>

        <Router>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verifyOtp" element={<OtpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/resetPassword/:token" element={<PasswordReset />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={
              <Elements stripe={stripePromise}>
                <CourseDetails />
              </Elements>
            } />
            <Route element={<StudentProtected />}>
              <Route path="/" element={<Home />} />
              <Route path="/myCourses" element={<MyCourses />} />
              <Route path="/myCourses/:courseId" element={<LecturePage />} />
              <Route path="/profile" element={<Profile userType="student" />} />
              <Route path="/messages" element={<StudentContacts />}>
                <Route path=":tutorId" element={<Chat />} />
              </Route>

            </Route>


            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminProtected />}>
              <Route path="/admin/home" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/tutors" element={<Tutors />} />
              <Route path="/admin/tutors/:tutorId" element={<TutorDetails />} />
              <Route path="/admin/categories" element={<Category />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/courseApplications" element={<CourseApplications />} />
              <Route path="/admin/courseApplications/:courseId" element={<CourseDetailsAdmin />} />
              <Route path="/admin/editApplications" element={<EditApplications />} />
              <Route path="/admin/editApplications/:courseId" element={<EditCourseDetails />} />
              <Route path="/admin/payments/pending" element={<PendingPayments />} />
              <Route path="/admin/payments/history" element={<PaymentHistory />} />
            </Route>



            <Route path="/tutor/register" element={<TutorRegisterPage />} />
            <Route path="/tutor/verifyOtp" element={<TutorOtp />} />
            <Route path="/tutor/login" element={<TutorLoginPage />} />
            <Route path="/tutor/resetPassword/:token" element={<TutorResetPassword />} />
            <Route element={<TutorProtected />}>
              <Route path="/tutor/home" element={<TutorHome />} />
              <Route path="/tutor/addCourse" element={<AddCourse />} />
              <Route path="/tutor/addLecture/:courseId" element={<AddLecture />} />
              <Route path="/tutor/myCourses" element={<TutorMyCourses />} />
              <Route path="/tutor/myCourses/:courseId" element={<TutorCourseDetails />} />
              <Route path="/tutor/editCourse/:courseId" element={<EditCoursePage />} />
              <Route path="/tutor/:courseId/lectures" element={<TutorLecturePage />} />
              <Route path="/tutorProfile" element={<Profile userType="tutor" />} />
              <Route path="/tutor/contacts" element={<TutorContacts />} >
                <Route path=":studentId" element={<Chat />} />
              </Route>
              <Route path="/tutor/payments" element={<Payments/>} />


            </Route>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </Router>
      </ThemeProvider>

    </>
  )
}

export default App
