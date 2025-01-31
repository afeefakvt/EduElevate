import React,  { useState, useEffect } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AxiosInstance } from "axios";




const AddCourse = () => {

    const [formData,setFormData] = useState({
        title:'',
        categoryId:"",
        description:"",
        price:"",
        language:"",
        duration:"",
        level:"intermediate",
        date:"",
        thumbnail:null,
    });

    const [categories,setCategories] = useState([])
    const levels = ['beginner','intermediate','advanced'];

    // useEffect(() => {
    //     // Fetch categories from backend
    //     axios.get("/api/categories")
    //       .then((response) => setCategories(response.data))
    //       .catch((error) => console.error("Error fetching categories", error));
    //   }, []);


    // const handleChange = (e:React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>)=>{
    //     setFormData((prev)=>({
    //         ...prev,
    //         [e.target.name]:e.target.value
    //     }))
    // }


    // const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{

    // }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // Submit data to backend
      };
  
    return (
        <Box   
            sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", 
          }}>
            <Navbar/>
            
        <Container maxWidth="md" sx={{
            flexGrow: 1, // Ensures it takes available space
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10, // Adds padding to avoid sticking to top
        }} >
          <Typography variant="h5" sx={{ my: 3 ,fontWeight:650}}>Add a Course</Typography>
          <Box
            component="form"    
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 ,width:"100%"}}
          >
            <Box sx={{ display: "flex", justifyContent: "center", }}>
              <Button sx={{backgroundColor: "#6A0DAD"}} variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Upload Thumbnail
                <input type="file" hidden  />
              </Button>
            </Box>
    
            <TextField label="Course Title" name="title" fullWidth required />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select name="categoryId" value={formData.categoryId} >
                {/* {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))} */}
              </Select>
            </FormControl>
            <TextField label="Description" name="description" fullWidth required multiline rows={3}  />
            <TextField label="Price" name="price" type="number" fullWidth required  />
            <TextField label="Duration (hours)" name="duration" type="number" fullWidth  />
            <TextField label="Language" name="language" fullWidth required />
            <TextField label="Date" name="date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
            
            <FormControl fullWidth>
              <InputLabel>Course Level</InputLabel>
              <Select name="level" value={formData.level} >
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
    
            <Button type="submit" variant="contained" sx={{ mt: 2,backgroundColor: "#6A0DAD" } }>
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
