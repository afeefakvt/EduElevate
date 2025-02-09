import { AxiosError } from "axios";


export const handleAxiosError = (error:unknown):never=>{
    if(error instanceof AxiosError){
        if(error.response){
            const errMessage = error.response.data.error || 
            error.response.data.errors?.[0].msg ||
            error.response.data.message || 
            "Somehting went wrong"
            throw new Error(errMessage)
            
        }
    }
    throw new Error((error as Error).message);

}