import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import OtpPage from "./pages/OtpPage"
import AdminLogin from "./components/admin/adminLogin"
import AdminDashboard from "./components/admin/adminDashboard"
import Students from "./components/admin/Students"
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
      </Routes>
     </Router>
    </>
  )
}

export default App
