import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; 
import { RootState } from "../../store/store";


const StudentProtected = () => {


  const token = useSelector((state:RootState)=>state.auth.token)
  const student = useSelector((state:RootState)=>state.auth.student)

  if(!token){
    return <Navigate to= "/login"/>
  }
// if(role && student?.role!==role){
//   return <Navigate to='/login'/>
// }

return <Outlet/>
  
}

export default StudentProtected