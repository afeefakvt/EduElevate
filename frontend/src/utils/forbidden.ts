import { AxiosError } from "axios";
import { store ,persistor} from "../store/store";
import { logout } from "../store/authSlice";

export const handleForbiddenError = (error:AxiosError):void=>{
    if(error.response && (error.response.status===403 || error.response?.status===401)){
        store.dispatch(logout())
        persistor.purge() //clear persisted redux state from local storage if redux persist is used
        console.log("dispatched");
        

        // window.location.href = '/login'
    }
}



