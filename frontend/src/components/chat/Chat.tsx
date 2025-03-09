import { Box, Typography, InputBase, Button, Avatar, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, CircularProgress, Snackbar, }
  from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useState, useEffect, useRef, } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import { RootState } from "@/store/store";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import LazyLoad from "react-lazyload";
import { IMessage } from "@/interfaces/interface";
import Bgimage from '../../assets/bg.jpeg'
import { getStudentById, getTutorMessages, uploadTutorMessageFile } from "@/api/tutorApi";
import { getTutorDetails } from "@/api/adminApi";
import { getStudentMessages, uploadStudentMessageFile } from "@/api/chatApi";
import Notification from "./Notification";



interface EmojiClickData {
  native: string;
}


const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loading, setLoading] = useState(false)
  const { tutorId, studentId } = useParams<{ tutorId?: string; studentId?: string }>()
  const [recipientName, setRecipientName] = useState('')
  const [recipientRole, setRecipientRole] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const student = useSelector((state: RootState) => state.auth.student)
  const tutor = useSelector((state: RootState) => state.tutorAuth.tutor)
  const navigate = useNavigate()
  const isTutor = Boolean(tutor)
  const isStudent = Boolean(student)
  const senderId = isTutor ? tutor?._id : student?._id
  const recipientId = isTutor ? studentId : tutorId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [openNotification, setOpenNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationSenderId, setNotificationSenderId] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
    }
  }, [messages])

  useEffect(() => {
    const fetchRecipientName = async () => {
      if (!recipientId) return;
      try {
        let data;
        if (isTutor) {
          data = await getStudentById(recipientId)
          setRecipientRole("student")
        } else {
          // console.log(recipientId,"recipeeeeeee");
          const response = await getTutorDetails(recipientId)
          data = response.tutor
          // console.log("data",data);
          setRecipientRole("tutor")
        }
        setRecipientName(data?.name || "Unknown")
      } catch (error) {
        console.error("failed to fetch recipient details", error)
      }
    };
    fetchRecipientName();
  }, [recipientId, isTutor]);

  useEffect(() => {
    // console.log("join rommmm");
    // console.log(senderId,"snde");
    // console.log(recipientId,"snde");

    if (!senderId || !recipientId) return;

    socket.emit('joinRoom', { senderId, recipientId });

    const fetchMessages = async () => {
      try {
        let response: IMessage[]
        if (isTutor) {
          response = await getTutorMessages(senderId, recipientId)
        } else {
          response = await getStudentMessages(senderId, recipientId)
        }
        // console.log(response,"messafess");

        setMessages(response)
        if (response.some((msg) => msg.senderId === recipientId && !msg.read)) {
          socket.emit("message_read", { senderId, recipientId })
        }
      } catch (error) {
        console.error("failed to fetch messages", error)

      }
    }
    fetchMessages()

    socket.on("receive_message", (msg) => {
      const isCurrentChat =
        (msg.senderId === senderId && msg.recipientId === recipientId) ||
        (msg.senderId === recipientId && msg.recipientId === senderId);

      // Show notifications only if the message is NOT from the current chat
      if (!isCurrentChat) {
        const isForTutor = isTutor && msg.recipientId === tutor?._id;
        const isForStudent = isStudent && msg.recipientId === student?._id;

        if (isForTutor || isForStudent) {
          setNotificationSenderId(msg.senderId);
          setNotificationMessage(`New message from ${recipientName || "Unknown"}`);
          setOpenNotification(true);
        }
      }

      // Add the message to the chat if it's from the current chat
      if (isCurrentChat) {
        setMessages((prevMessages) => [...prevMessages, msg]);

        if (msg.senderId === recipientId) {
          socket.emit("message_read", { senderId, recipientId });
        }
      }
    });


    socket.on("message_read", ({ senderId: msgSenderId, recipientId: msgRecipientId, readAt }) => {
      // console.log("read console");

      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.senderId === msgSenderId && msg.recipientId === msgRecipientId && !msg.read) {
            return {
              ...msg,
              read: true,
              readAt: readAt
            }
          }
          return msg
        })
      )
    })

    socket.on("message_deleted", ({ messageId }) => {
      console.log("Deleting message with ID:", messageId);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, message: "This message was deleted" } : msg
        )
      )
    })
    return () => {
      socket.off("receive_message")
      socket.off("message_read")
      socket.off("message_deleted")
    }

  }, [senderId, recipientId]);

  const handleNotificationClick = () => {
    if (notificationSenderId) {
      if (recipientRole === "tutor") {
        navigate(`/messages/${notificationSenderId}`)
      } else {
        navigate(`/tutor/contacts/${notificationSenderId}`)
      }
    }
  }

  const handleNotificationClose = () => {
    setOpenNotification(false)
  }

  const sendMessage = async () => {
    // console.log(message,"kkkkkkk");
    // console.log(senderId,"kkkkkkk");
    // console.log(recipientId,"kkkkkkk");

    if ((!message.trim() && !file) || !senderId || !recipientId) return;
    setLoading(true)
    try {
      const messageData = {
        senderId,
        recipientId,
        message: message.trim(),
        fileUrl: null,
        fileType: null as string | null,
        read: false,
        timestamp: new Date().toISOString()
      };
      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const fileType = file.type.startsWith("image") ? "image" : "video";

        let data;
        if (isTutor) {
          data = await uploadTutorMessageFile(formData, fileType);
        } else {
          data = await uploadStudentMessageFile(formData, fileType)
        }
        messageData.fileUrl = data.imageUrl || data.videoUrl
        messageData.fileType = fileType

      }
      // console.log("messgae",messageData);

      socket.emit("message", messageData)

      setMessage('')
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFilePreview(null)
    } catch (error) {
      console.error("Upload error:", error)

    } finally {
      setLoading(false)
    }

  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setFile(file)
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setFilePreview(previewUrl)
    }
  }

  const handleDeleteClick = (messageId: string) => {
    setMessageToDelete(messageId);
    setOpenModal(true);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      handleDeleteMessage(messageToDelete);
      setOpenModal(false);
      setMessageToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenModal(false);
    setMessageToDelete(null);
  };
  const handleDeleteMessage = (messageId: string) => {
    socket.emit("delete_message", { messageId, senderId });
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setMessage(message + emojiData.native);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };


  return (
    <>

      <Notification open={openNotification} message={notificationMessage} onClose={handleNotificationClose} onClick={handleNotificationClick} />

      <Snackbar
        open={snackbar}
        message={snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />

      <Box
        sx={{
          bgcolor: "#550A8A",
          color: "white",
          height: "2.3%",
          width: "auto",
          p: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          sx={{ display: { xs: "block", md: "none" }, color: "white" }}
          onClick={() => {
            if (student) {
              navigate('/messages')
            } else if (tutor) {
              navigate('/tutors/contacts')
            }
          }
          }
        >
          <ArrowBackOutlinedIcon />
        </IconButton>

        <Avatar sx={{ bgcolor: "white", color: "#550A8A" }}>
          {recipientName ? recipientName[0]?.toUpperCase() : "?"}
        </Avatar>
        <Typography sx={{ ml: 2 }}>{recipientName || "Unknown"}</Typography>

      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "#f4f4f8",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box sx={{ p: 3 }}>
          {messages.map((msg, index) => {
            const isSender = msg.senderId === senderId;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isSender ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "60%",
                    p: 1.5,
                    borderRadius: 3,
                    wordBreak: "break-word",
                    bgcolor: isSender ? "white": "#550A8A",
                    color: isSender ? "text.primary" : "white",
                    textAlign: isSender ? "right" : "left",
                    "&:hover": {
                      ".delete-icon": { opacity: 0.7 },
                    },
                  }}
                >

                  <Typography
                    variant="body2"
                    sx={{ wordBreak: "break-word", mr: 1.5 }}
                  >
                    {msg.message === "This message was deleted" ? (
                      <Typography
                        sx={{
                          color: isSender ? "text.secondary" : "#fff",
                          fontSize: 12,
                          fontStyle: "italic",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <NotInterestedIcon sx={{ fontSize: 12 }} /> This
                        message was deleted
                      </Typography>
                    ) : (
                      msg.message
                    )}
                  </Typography>
                  {isSender && msg.message !== "This message was deleted" && (
                    <DeleteIcon
                      onClick={() => handleDeleteClick(msg._id)}
                      className="delete-icon"
                      sx={{
                        fontSize: 15,
                        cursor: "pointer",
                        color: "gray",
                        opacity: 0,
                        transition: "opacity 0.3s",
                        position: "absolute",
                        top: 5,
                        right: 5,
                      }}
                    />
                  )}

                  {msg.fileUrl && msg.message !== "This message was deleted" && (
                    <Box sx={{ mt: 2, maxWidth: "100%" }}>
                      {msg.fileType === "image" ? (
                        <Box
                          component="img"
                          src={msg.fileUrl}
                          alt="Attachment"
                          loading="lazy"
                          sx={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "auto",
                            borderRadius: 2,
                            display: "block",
                          }}
                        />
                      ) : (
                        <Box
                          component="video"
                          controls
                          preload="none"
                          sx={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "auto",
                            borderRadius: 2,
                            display: "block",
                          }}
                        >
                          <source src={msg.fileUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </Box>
                      )}
                    </Box>
                  )}


                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isSender ? "flex-end" : "flex-start",
                      mt: 1,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.7rem",
                        color: isSender ? "text.secondary" : "white",
                      }}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "N/A"}
                    </Typography>

                    {isSender && msg.message !== "This message was deleted" && (
                      <Tooltip
                        title={
                          msg.readAt
                            ? `Read at ${new Date(msg.readAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                            : "Not read yet"
                        }
                        placement="top"
                        arrow
                      >

                        <DoneAllIcon
                          sx={{
                            fontSize: 14,
                            color: msg.read ? "#2196f3" : "rgba(0, 0, 0, 0.3)",
                            ml: 1,
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: { xs: 0, md: 2 },
          pt: 0,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "sticky",
          bottom: 0,
        }}
      >
        {filePreview && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
            {file?.type.startsWith("image") ? (
              <img
                src={filePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  height: "auto",
                  borderRadius: 0,
                }}
              />
            ) : (
              <video
                src={filePreview}
                controls
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  height: "auto",
                  borderRadius: 0,
                }}
              />
            )}
            <IconButton
              onClick={() => {
                setFile(null);
                setFilePreview(null);
              }}
            >
              <CancelIcon />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            p: "4px",
            pr: 1,
          }}
        >
          <Button onClick={toggleEmojiPicker}>
            <EmojiEmotionsIcon style={{ fontSize: "25px" }} />
          </Button>
          {showEmojiPicker && (
            <Box
              sx={{
                position: "absolute",
                bottom: "100%",
                left: "2%",
                zIndex: 1000,
                marginBottom: "10px",
              }}
            >
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </Box>
          )}
          <InputBase
            sx={{
              flex: 1,
              px: 0,
              py: 1,
              "& input": {
                fontSize: "1rem",
              },
            }}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <AttachFileIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={sendMessage}
            endIcon={
              loading ? (
                <CircularProgress
                  size={20}
                  sx={{ color: "blue", margin: "auto" }}
                />
              ) : (
                <SendIcon />
              )
            }
            disabled={loading || (!message && !file)}
            sx={{
              borderRadius: 6,
              textTransform: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 3,
              "&:hover": {
                transform: "translateY(-1px)",
                transition: "transform 0.2s",
              },
            }}
          >
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Send
            </Box>
          </Button>
        </Box>
      </Box>
      <Dialog
        open={openModal}
        onClose={handleCancelDelete}
        aria-labelledby="delete-message-dialog-title"
        aria-describedby="delete-message-dialog-description"
      >
        <DialogTitle id="delete-message-dialog-title"
          sx={{ fontSize: { xs: 16, md: 20 } }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-message-dialog-description"
            sx={{ fontSize: { xs: 12, md: 16 }, mb: -2 }}
          >
            Are you sure you want to delete this message? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Chat
