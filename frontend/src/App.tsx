import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/loginPage"
import RegisterPage from "./pages/RegisterPage"

function App() {


  return (
    <>
     <Router>
      <Routes>
     
        <Route path="/" element = {<Home/>}/>
        <Route path="/register" element = {<RegisterPage/>}/>
        <Route path="/login" element = {<LoginPage/>}/>
      </Routes>
     </Router>
    </>
  )
}

export default App
