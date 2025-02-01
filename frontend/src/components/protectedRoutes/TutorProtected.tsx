import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; 
import { RootState } from "../../store/store";


const TutorProtected = () => {


  const token = useSelector((state:RootState)=>state.tutorAuth.token)
  const tutor = useSelector((state:RootState)=>state.tutorAuth.tutor)

  if(!token){
    return <Navigate to= "/tutor/login" replace/>
  }

return <Outlet/>
  
}

export default TutorProtected