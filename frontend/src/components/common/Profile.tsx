import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "../../components/common/Navbar"
import Footer from "../../components/common/Footer"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { editProfile } from "@/api/studentApi";
import { logout, updateStudent } from "@/store/authSlice";
import { changePassword } from "@/api/studentApi";
import { validateChangePasswordForm, validateEditProfileForm } from "@/utils/validations";
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Profile = () => {
    const tutor = useSelector((state: RootState) => state.tutorAuth.tutor)
    const student = useSelector((state: RootState) => state.auth.student)
    const [name, setName] = useState(student?.name || "")
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [nameError, setNameError] = useState<string | null>(null)
    const [passwordErrors, setPasswordErrors] = useState<{ currentPassword?:string;password?: string; confirmPassword?: string }>({});
    const dispatch = useDispatch()

   

    const updateName = async () => {
        setNameError(null);

        const errors = validateEditProfileForm(name);
        if (errors.name) {
            setNameError(errors.name);
            return;
        }

        try {
            if (!student?._id) {
                setError("student id is missing")
                return;
            }
            const response = await editProfile(student._id, name)
            setName(response.result.name)
            dispatch(updateStudent({ student: response.result }));
            toast.success("Profile updated successfully!");

        } catch (error) {
            console.log(error);
        } 
    }

    const updatePassword = async () => {
        setError('');
        setPasswordErrors({});

        const errors = validateChangePasswordForm(currentPassword,newPassword, confirmPassword);
        if (errors.currentPassword  || errors.password || errors.confirmPassword) {
            setPasswordErrors(errors);
            return;
        }

        if (!student?._id) {
            setError("student id is missing")
            return;
        }
        try {
            console.log("change pass");
            

            await changePassword(student._id, currentPassword, newPassword)
            toast.success("Password changed successfully! Logging out...");

            setTimeout(() => {
                dispatch(logout())
                
            }, 3500);
         
        } catch (error: any) {
            setError(error.message || "Failed to change password");

        } 

    }

    if (!student) return <div className="text-center mt-10">Loading...</div>
    return (

        <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="flex-1 container mx-auto mt-28 mb-28 p-6 max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Profile Settings</h1>


                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="flex justify-center mb-6">
                        <TabsTrigger value="profile">Profile Management</TabsTrigger>
                        <TabsTrigger value="password">Change Password</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you're done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {error && <p className="text-red-500">{error}</p>}

                                <div className="space-y-1">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="email" disabled value={student?.email} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="username">Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    {nameError && <p className="text-red-500">{nameError}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-[#550A8A] hover:bg-[#6A0DAD] text-white" onClick={updateName}>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>


                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {error && <p className="text-red-500">{error}</p>}

                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                    {passwordErrors.currentPassword && <p className="text-red-500">{passwordErrors.currentPassword}</p>}

                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    {passwordErrors.password && <p className="text-red-500">{passwordErrors.password}</p>}

                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">Confirm new password</Label>
                                    <Input id="new" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    {passwordErrors.confirmPassword && <p className="text-red-500">{passwordErrors.confirmPassword}</p>}

                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-[#550A8A] hover:bg-[#6A0DAD] text-white" onClick={updatePassword}
                                >Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
            <ToastContainer />

        </div>
    )
}

export default Profile