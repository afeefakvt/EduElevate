import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import OtpPage from "./pages/OtpPage"

import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/AdminDashboard"
import Students from "./components/admin/Students"
import Tutors from "./components/admin/tutors"


import TutorHome from "./components/tutor/tutorHome"
import TutorRegisterPage from "./components/tutor/RegisterPage"
import TutorOtp from "./components/tutor/Otp"
import TutorLoginPage from './components/tutor/LoginPage'


function App() {


  return (
    <>
     <Router>
      <Routes>
     
        <Route path="/" element = {<Home/>}/>
        <Route path="/register" element = {<RegisterPage/>}/>
        <Route path="/verifyOtp" element = {<OtpPage/>}/>
        <Route path="/login" element = {<LoginPage/>}/>
        

        <Route path="/admin/login" element = {<AdminLogin/>}/>
        <Route path="/admin/home" element = {<AdminDashboard/>}/>
        <Route path="/admin/students" element = {<Students/>}/>
        <Route path="/admin/tutors" element = {<Tutors/>}/>


        <Route path="/tutor/register" element = {<TutorRegisterPage/>}/>
        <Route path="/tutor/verifyOtp" element = {<TutorOtp/>}/>
        <Route path="/tutor/login" element = {<TutorLoginPage/>}/>
        <Route path="/tutor/home" element = {<TutorHome/>}/>
      </Routes>
     </Router>
    </>
  )
}

export default App
