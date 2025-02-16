import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "../common/Footer";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
  Box,
  SelectChangeEvent,
  Alert
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { addCourse, getCategories } from "../../api/courseApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { validateAddCourseForm } from "../../utils/validations";






const EditCoursePage = () => {

  const [formData, setFormData] = useState({
    title: '',
    categoryId: "",
    description: "",
    price: "",
    language: "english",
    duration: "",
    level: "intermediate",
    thumbnail: null as File | null,
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const levels = ['beginner', 'intermediate', 'advanced'];
  const languages = ["english", "malayalam"];
  const [errMessage, setErrMessage] = useState('')
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const tutor = useSelector((state: RootState) => state.tutorAuth.tutor)
  const tutorId = tutor?._id

  interface Category {
    _id:string;
    name:string;
    isListed:Boolean;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategories();
        console.log("Fetched categories:", categoryData); // Debugging line
        const filteredCategories = categoryData.filter((category:Category) => category.isListed === true);
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories()
  }, []);



  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value
  //   }))
  // }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
   setFormData((prev) => ({
      ...prev,
      [name]: value
   }));
   // Clear errors when user updates the field
   setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ""
   }));
  }
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      // Create a preview URL
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }

  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMessage('')

    // Validate form data
    const errors = validateAddCourseForm({
      ...formData,
      category: formData.categoryId,
      price: Number(formData.price),
    });
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('language', formData.language);
    formDataToSend.append('duration', formData.duration);
    formDataToSend.append('level', formData.level);

    // Append file if it exists
    if (formData.thumbnail) {
      formDataToSend.append('thumbnail', formData.thumbnail);
    }
    if (tutorId) {
      formDataToSend.append('tutorId', tutorId);
    } else {
      console.error("Tutor ID is missing");
      setErrMessage("Tutor ID is required");
      return;
    }


 // Debugging: Log the FormData being sent
 console.log("FormData being sent:", Object.fromEntries(formDataToSend.entries()));

    try {
      console.log("Submitting:", formDataToSend);
      const response = await addCourse(formDataToSend)
      const courseId = response.newCourse._id

      navigate(`/tutor/addLecture/${courseId}`)


    } catch (error) {
      console.error("Failed to add course", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}>
      <Navbar />

      <Container maxWidth="md" sx={{
        flexGrow: 1, // Ensures it takes available space
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 15, // Adds padding to avoid sticking to top
      }} >
        <Typography variant="h5" sx={{ my: 3, fontWeight: 650 }}>Add a Course</Typography>


        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Button sx={{ backgroundColor: "#6A0DAD" }} variant="contained" component="label" startIcon={<CloudUploadIcon />}>
              Upload Thumbnail
              <input type="file" name="thumbnail" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {formErrors.thumbnail && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {formErrors.thumbnail}
              </Typography>
            )}
            {imagePreview && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                {/* <Typography variant="body2" color="textSecondary">
                  Preview:
                </Typography> */}
                <img
                  src={imagePreview}
                  alt="Thumbnail Preview"
                  style={{
                    width: "150px",
                    height: "auto",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    marginTop: "8px",
                  }}
                />
              </Box>
            )}
          </Box>
          {errMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errMessage}
            </Alert>
          )}

          <TextField label="Course Title" name="title" fullWidth required onChange={handleChange} error={!!formErrors.title}
            helperText={formErrors.title} />
          <FormControl fullWidth required error={!!formErrors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select name="categoryId" value={formData.categoryId} onChange={handleSelectChange} >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.categoryId && (
              <Typography variant="caption" color="error">
                {formErrors.categoryId}
              </Typography>
            )}
          </FormControl>
          <TextField label="Description" name="description" fullWidth required multiline rows={3} onChange={handleChange}
            error={!!formErrors.description}
            helperText={formErrors.description} />
          <TextField label="Price(₹)" name="price" fullWidth required onChange={handleChange}
            error={!!formErrors.price}
            helperText={formErrors.price} />
          <TextField label="Duration " name="duration" fullWidth onChange={handleChange}
            error={!!formErrors.duration}
            helperText={formErrors.duration} />
          {/* <TextField label="Language" name="language" fullWidth required onChange={handleChange}
            error={!!formErrors.language}
            helperText={formErrors.language} /> */}

          <FormControl fullWidth error={!!formErrors.language}>
            <InputLabel>Course Language</InputLabel>
            <Select name="language" value={formData.language} onChange={handleSelectChange} >
              {languages.map((language) => (
                <MenuItem key={language} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </MenuItem>
              ))}
            </Select>
            {formErrors.language && (
              <Typography variant="caption" color="error">
                {formErrors.language}
              </Typography>
            )}
          </FormControl>
          <FormControl fullWidth error={!!formErrors.level}>
            <InputLabel>Course Level</InputLabel>
            <Select name="level" value={formData.level} onChange={handleSelectChange} >
              {levels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </MenuItem>
              ))}
            </Select>
            {formErrors.level && (
              <Typography variant="caption" color="error">
                {formErrors.level}
              </Typography>
            )}
          </FormControl>

          <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#6A0DAD" }} >
            Save and Next
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>

  );
}

export default EditCoursePage