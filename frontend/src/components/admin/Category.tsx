"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";


interface Category {
  _id: string;
  name: string;
  isListed: boolean;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [errMessage,setErrMessage] = useState('')
  const [open, setOpen] = useState(false); 
  const [openEdit, setOpenEdit] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const categoriesPerPage = 5;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/category");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggle = async (id: string, isListed: boolean) => {
    try {
      await axiosInstance.patch(`/admin/category/${id}/listUnlistCategory`, { isListed: !isListed });
      fetchCategories(); 
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleAddCategoryOpen = () => {
    setErrMessage("");  // Reset error message
    setNewCategoryName(""); // Reset input field
    setOpen(true);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()){
      setErrMessage("Category name cannot be empty.");
      return;
    }
    try {
      console.log("category request ")
      await axiosInstance.post("/admin/category/addCategory", { name: newCategoryName });
      setNewCategoryName("");
      setErrMessage('')
      setOpen(false); 
      fetchCategories(); 
    } catch (error:any) {
      console.error("Error adding category:", error);
      setErrMessage(error.response?.data?.message || "Failed to add category. Please try again.");

    }
  };


  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setEditCategoryName(category.name);
    setErrMessage(""); 
    setOpenEdit(true);
  };
  const handleEditCategory = async () => {
    if (!editCategory || !editCategoryName.trim()) {
      setErrMessage("Category name cannot be empty.");
      return;
    }
    try {
      await axiosInstance.put(`/admin/category/${editCategory._id}/editCategory`, { name: editCategoryName });
      setErrMessage("");
      setOpenEdit(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Error updating category:", error);
      setErrMessage(error.response?.data?.message || "Failed to update category.");
    }
  };


  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );
  
  // Pagination Logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);



  return (
    <div className="relative min-h-screen">
    {/* Navbar */}
    <AdminNavbar />
    <div>
      <Sidebar/>
    </div>
    <div className="container mx-auto mt-5 p-4" style={{ paddingTop: "150px",width:"1100px", marginLeft:"350px"}} >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search Categories..."
            className="w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={handleAddCategoryOpen}>+ Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
             {errMessage && <p className="text-red-500 text-sm mt-1">{errMessage}</p>}
            <Button onClick={handleAddCategory} className="mt-2 w-full">
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? <p>Loading...</p> : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Listed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Switch
                        checked={category.isListed}
                        onCheckedChange={() => handleToggle(category._id, category.isListed)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="default" onClick={()=>handleEdit(category)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <Button variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )} 
      </div>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Enter category name"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
             {errMessage && <p className="text-red-500 text-sm mt-1">{errMessage}</p>}
            <Button onClick={handleEditCategory} className="mt-2 w-full">
              Update
            </Button>
          </DialogContent>
        </Dialog>
      
    </div>
  );
}

