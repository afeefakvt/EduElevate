import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import OtpPage from "./pages/OtpPage"
import StudentProtected from "./components/protectedRoutes/Studentprotected"


import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/AdminDashboard"
import Students from "./components/admin/Students"
import Tutors from "./components/admin/Tutors"
import TutorDetails from "./components/admin/TutorDetails"
import Category from "./components/admin/Category"
import TutorProtected from "./components/protectedRoutes/TutorProtected"

 
import TutorHome from "./components/tutor/tutorHome"
import TutorRegisterPage from "./components/tutor/RegisterPage"
import TutorOtp from "./components/tutor/Otp"
import TutorLoginPage from './components/tutor/LoginPage'
import AddCourse from "./components/tutor/AddCourse"
import AddLecture from "./components/tutor/AddLecture"
import AdminProtected from "./components/protectedRoutes/AdminProtected"


function App() {
  return (
    <>
     <Router>
      <Routes>
     
        <Route path="/" element = {<Home/>}/>
        <Route path="/register" element = {<RegisterPage/>}/>
        <Route path="/verifyOtp" element = {<OtpPage/>}/>
        <Route path="/login" element = {<LoginPage/>}/>
        <Route element={<StudentProtected/>}>
         <Route path="/" element = {<Home/>}/>
        </Route>
        

        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route element={<AdminProtected />}>
         <Route path="/admin/home" element = {<AdminDashboard/>}/>
         <Route path="/admin/students" element = {<Students/>}/>
         <Route path="/admin/tutors" element = {<Tutors/>}/>
         <Route path="/admin/tutors/:tutorId" element = {<TutorDetails/>}/>
         <Route path="/admin/categories" element = {<Category/>}/>
        </Route>

       
        <Route path="/tutor/register" element = {<TutorRegisterPage/>}/>
        <Route path="/tutor/verifyOtp" element = {<TutorOtp/>}/>
        <Route path="/tutor/login" element = {<TutorLoginPage/>}/>
        <Route element={<TutorProtected/>}>
         <Route path="/tutor/home" element = {<TutorHome/>}/>
         <Route path="/tutor/addCourse" element = {<AddCourse/>}/>
         <Route path="/tutor/addLecture" element = {<AddLecture/>}/>
        </Route>
       
      </Routes>
     </Router>
    </>
  )
}

export default App
