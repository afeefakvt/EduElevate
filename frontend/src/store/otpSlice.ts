import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface OtpState{
    timer:number,
    isResendEnabled:boolean;
}

const initialState:OtpState = {
    timer:60,
    isResendEnabled:true
}

const otpSlice = createSlice({
    name:'otp',
    initialState,
    reducers:{
        startOtpTimer:(state,action:PayloadAction<number>)=>{
            state.timer = action.payload;
            state.isResendEnabled =true
        },
        decrementOtpTimer:(state)=>{
            if(state.timer>0){
                state.timer-=1;
            }
            if(state.timer===0){
                state.isResendEnabled = false
            }
        },
        resetOtpTimer:(state)=>{
            state.timer =60;
            state.isResendEnabled= true;
        }
    }
})
export const { startOtpTimer, decrementOtpTimer, resetOtpTimer } = otpSlice.actions;
export default otpSlice.reducer;