import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; 
import { RootState } from "../../store/store";


const AdminProtected = () => {


  const token = useSelector((state:RootState)=>state.auth.token)

  if(!token){
    return <Navigate to= "/admin/login"/>
  }


return <Outlet/>
  
}

export default AdminProtected