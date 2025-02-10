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






const AddCourse = () => {

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



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategories();
        console.log("Fetched categories:", categoryData); // Debugging line
        setCategories(categoryData)
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
        py: 10, // Adds padding to avoid sticking to top
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

export default AddCourse




// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Checkbox } from "@/components/ui/checkbox";

// export function AddCourse() {
//   const [lectures, setLectures] = useState<{ title: string; video: File | null }[]>([]);
//   const [lectureTitle, setLectureTitle] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isChecked, setIsChecked] = useState(false);

//   const handleAddLecture = () => {
//     if (lectureTitle && selectedFile) {
//       setLectures([...lectures, { title: lectureTitle, video: selectedFile }]);
//       setLectureTitle("");
//       setSelectedFile(null);
//     }
//   };

//   return (
//     <Tabs defaultValue="create-course" className="w-[400px]">
//       <TabsList className="grid w-full grid-cols-3">
//         <TabsTrigger value="create-course">Create Course</TabsTrigger>
//         <TabsTrigger value="add-lectures">Add Lectures</TabsTrigger>
//         <TabsTrigger value="publish-course">Publish Course</TabsTrigger>
//       </TabsList>

//       {/* Create Course Tab */}
//       <TabsContent value="create-course">
//         <Card>
//           <CardHeader>
//             <CardTitle>Create Course</CardTitle>
//             <CardDescription>Fill in the details of your course.</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div className="space-y-1">
//               <Label htmlFor="course-title">Course Title</Label>
//               <Input id="course-title" placeholder="Enter course title" />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="course-description">Course Description</Label>
//               <Input id="course-description" placeholder="Enter course description" />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="course-thumbnail">Course Thumbnail</Label>
//               <Input id="course-thumbnail" type="file" accept="image/*" />
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button>Save Course</Button>
//           </CardFooter>
//         </Card>
//       </TabsContent>

//       {/* Add Lectures Tab */}
//       <TabsContent value="add-lectures">
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Lectures</CardTitle>
//             <CardDescription>Add multiple lectures to your course.</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div className="space-y-1">
//               <Label htmlFor="lecture-title">Lecture Title</Label>
//               <Input id="lecture-title" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} placeholder="Enter lecture title" />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="lecture-video">Upload Lecture Video</Label>
//               <Input id="lecture-video" type="file" accept="video/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
//             </div>
//             <Button onClick={handleAddLecture} disabled={!lectureTitle || !selectedFile}>
//               Add Lecture
//             </Button>
//             <div className="mt-4">
//               {lectures.length > 0 && (
//                 <div>
//                   <h4 className="text-lg font-semibold">Lecture List</h4>
//                   <ul className="list-disc pl-4">
//                     {lectures.map((lecture, index) => (
//                       <li key={index}>{lecture.title} - {lecture.video?.name}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       {/* Publish Course Tab */}
//       <TabsContent value="publish-course">
//         <Card>
//           <CardHeader>
//             <CardTitle>Publish Course</CardTitle>
//             <CardDescription>Are you sure you want to publish this course?</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox id="publish-confirm" onCheckedChange={(checked) => setIsChecked(!!checked)} />
//               <Label htmlFor="publish-confirm">Are you sure?</Label>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button disabled={!isChecked}>Publish Course</Button>
//           </CardFooter>
//         </Card>
//       </TabsContent>
//     </Tabs>
//   );
// }
