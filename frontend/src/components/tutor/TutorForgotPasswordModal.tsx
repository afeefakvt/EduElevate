import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { axiosInstance } from '../../api/axiosInstance'
import { AxiosError } from "axios";



const TutorForgotPasswordModal = ({open,handleClose}:{open:boolean,handleClose:()=>void}) => {
    const [email,setEmail] = useState('');
    const [errMessage,setErrMessage] = useState("")
    const [successMessage,setSuccessMessage] = useState('')
    const [status,setStatus]  =useState<"idle"|"loading" | "success" | "error">('idle')


    const handleSubmit = async()=>{
        try {
            setStatus("loading")
            await axiosInstance.post('/tutor/forgotPassword',{email})
            setSuccessMessage('Reset link send to your email');
            setStatus("idle");
            setErrMessage('');
            setTimeout(()=>{
                handleClose()
            },3000);
        } catch (error:unknown) {
            const errorMsg =
            (error instanceof AxiosError && error.response?.data?.message) ||
            "An unexpected errror occured";
          setErrMessage(errorMsg);
          console.log("error is", errorMsg);
          setStatus("idle");
            
        }

    }
  return (
    <div>
    <Modal
        open={open}
        onClose={handleClose}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          "& .MuiModal-backdrop": {
            bgcolor: "white",
          },
        }}
      >
        <Box sx={{ border: "none", outline: "none" }}>
          <Typography variant="h5" textAlign={"center"} gutterBottom>
            Reset Password{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your registered email address to recieve a password reset link{" "}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            sx={{ mb: 0 }}
            label="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value !== "") {
                setErrMessage("");
              }
            }}
          />
          <Box sx={{ mb: 2, height: "10px" }}>
            {errMessage && (
              <Typography variant="caption" sx={{ color: "red" }}>
                {errMessage}
              </Typography>
            )}

            {successMessage && (
              <Typography variant="caption" sx={{ color: "green" }}>
                {successMessage}
              </Typography>
            )}
          </Box>

          <Box display={"flex"} justifyContent={"center"}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              color="primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </Button>
          </Box>
        </Box>
      </Modal>
      </div>

    
  )
}

export default TutorForgotPasswordModal