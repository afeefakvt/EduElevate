// import { createSlice,PayloadAction } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";

// interface Student {
//     id:string,
//     name:string,
//     email:string,
//     password:string,
//     role:string
// }
// interface AuthState {
//     token: string | null
//     student:Student | null
// }
// const initialState :AuthState = {
//     token : Cookies.get('adminAuthToken') || null,
//     student:null,
// }
// const adminAuthSlice = createSlice({
//     name:"adminAuth",
//     initialState,
//     reducers:{
//         adminLoginSuccess:(state,action:PayloadAction<{token:string,student:Student}>)=>{
//             state.token = action.payload.token
//             state.student = action.payload.student
//             Cookies.set('adminAuthToken',action.payload.token,{expires:7})
//         },
//         adminLogout:(state)=>{
//             state.token = null
//             state.student = null
//             Cookies.remove('adminAuthToken')
//         }
//     }

// })

// export const { adminLoginSuccess,adminLogout } = adminAuthSlice.actions;
// export default adminAuthSlice.reducer;