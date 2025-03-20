import Banner from "./Banner"
import Banner2 from "./Banner2"
import Navbar from "./Navbar"
import Footer from "../common/Footer"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import BecomeStudent from "./BecomeStudent"



const tutorHome = () => {
  const tutorToken = useSelector((state:RootState)=>state.tutorAuth.token)
  return (
    <div>
        <Navbar/>
        <Banner/>
        {tutorToken && <Banner2/>}
        {!tutorToken && <BecomeStudent/>}
        <Footer/>
    </div>
  )
}

export default tutorHome