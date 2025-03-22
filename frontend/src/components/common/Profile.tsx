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
import StudentNavbar from "../../components/common/Navbar"
import TutorNavbar from "../../components/tutor/Navbar"
import Footer from "../../components/common/Footer"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import React, {  useState } from "react";
import { editProfile } from "@/api/studentApi";
import { logout, updateStudent } from "@/store/authSlice";
import { changePassword } from "@/api/studentApi";
import { validateChangePasswordForm, validateTutorEditProfileForm,validateStudentEditProfileForm } from "@/utils/validations";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { editTutorProfile, tutorChangePassword } from "@/api/tutorApi";
import { tutorLogout, updateTutor } from "@/store/tutorAuthSlice";
import { ProfileProps } from "@/interfaces/interface";


const Profile: React.FC<ProfileProps> = ({ userType }) => {

    const user = useSelector((state: RootState) =>
        userType === "student" ? state.auth.student : state.tutorAuth.tutor
    );

    const [name, setName] = useState(user?.name || "")
    const [title, setTitle] = useState(
        userType === "tutor" && user && "title" in user ? user.title : ""
      );
      const [bio, setBio] = useState(
        userType === "tutor" && user && "bio" in user ? user.bio : ""
      );
      
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [studentProfileError,setStudentProfileError] = useState<string | null>(null)
    const [tutorProfileError, setTutorProfileError] = useState<{name?:string,title?:string,bio?:string}>({})
    const [passwordErrors, setPasswordErrors] = useState<{ currentPassword?: string; password?: string; confirmPassword?: string }>({});
    const dispatch = useDispatch()



    const handleLogout = () => {
        if (userType === "student") {
            dispatch(logout());
        } else if (userType === "tutor") {
            dispatch(tutorLogout());
        }
    };  

    const updateName = async () => {
        if(userType==="tutor"){
            setTutorProfileError({});

        const errors = validateTutorEditProfileForm(name,title,bio);
        if (errors.name || errors.title || errors.bio) {
            setTutorProfileError(errors);
            return;
        }

        }else{
            setStudentProfileError(null)
            
        const errors = validateStudentEditProfileForm(name);
        if (errors.name) {
            setStudentProfileError(errors.name);
            return;
        }

        }
        

        try {
            if (!user?._id) {
                setError("student id is missing")
                return;
            }
            let response
            if (userType === "student") {
                response = await editProfile(user._id, name)
                setName(response.result.name)
                dispatch(updateStudent({ student: response.result }))

            } else {
                response = await editTutorProfile(user._id, name,title,bio);
                setName(response.result.name)
                setTitle(response.result.title)
                setBio(response.result.bio)
                dispatch(updateTutor({ tutor: response.result }))
            }

            toast.success("Profile updated successfully!");

        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile.");

        }
    }

    const updatePassword = async () => {
        setError('');
        setPasswordErrors({});

        const errors = validateChangePasswordForm(currentPassword, newPassword, confirmPassword);
        if (errors.currentPassword || errors.password || errors.confirmPassword) {
            setPasswordErrors(errors);
            return;
        }

        if (!user?._id) {
            setError("student id is missing")
            return;
        }
        try {
            // console.log("change pass");

            if (userType === "student") {
                await changePassword(user._id, currentPassword, newPassword);
            } else {
                await tutorChangePassword(user._id, currentPassword, newPassword);
            }
            toast.success("Password changed successfully! Logging out...");

            setTimeout(() => {
                handleLogout()
            }, 3500);

        } catch (error: any) {
            setError(error.message || "Failed to change password");
        }
    }

    if (!user) return <div className="text-center mt-10">Loading...</div>

    return (

        <div className="flex flex-col min-h-screen">
            {userType === "student" ? <StudentNavbar /> : <TutorNavbar />}

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
                                    Make changes to your profile here. Click save when you're done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {error && <p className="text-red-500">{error}</p>}

                                <div className="space-y-1">
                                    <Label htmlFor="name">Email</Label>
                                    <Input id="email" disabled value={user?.email} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="username">Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    {userType === "tutor" && tutorProfileError?.name && <p className="text-red-500">{tutorProfileError.name}</p>}
                                    {userType === "student" && studentProfileError && <p className="text-red-500">{studentProfileError}</p>}
                                </div>
                                {userType === "tutor" && user && "title" in user && "bio" in user && (
                                    <>
                                        <div className="space-y-1">
                                            <Label htmlFor="title">Title</Label>
                                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} /> 
                                            {tutorProfileError?.title && <p className="text-red-500">{tutorProfileError.title}</p>}

                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="bio">Bio</Label>
                                            <textarea
                                                id="bio"
                                                rows={4}
                                                className="w-full p-2 border rounded-md"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                            ></textarea>
                                         {tutorProfileError?.bio && <p className="text-red-500">{tutorProfileError.bio}</p>}

                                        </div>
                                    </>
                                )}
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