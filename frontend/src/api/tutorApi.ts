import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { axiosInstance } from "../api/tutorAxiosInstance";
import { store } from "../store/store";
import { tutorLoginSuccess } from "../store/tutorAuthSlice";
import { handleAxiosError } from "@/utils/errorHandler";

export const signUp = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  title: string,
  bio: string
) => {
  try {
    const repsonse = await axiosInstance.post("/tutor/register", {
      name,
      email,
      password,
      confirmPassword,
      title,
      bio,
    });
    return repsonse.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const validationErrors = error.response?.data.errors;
      if (validationErrors) {
        const errorMessage = validationErrors
          .map((err: any) => err.msg)
          .join(", ");
        throw new Error(errorMessage);
      }
      const errMessage =
        error.response?.data.message || " something went wrong";
      throw new Error(errMessage);
    }
    throw new Error((error as Error).message);
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const reposne = await axiosInstance.post("/tutor/verifyOtp", {
      email,
      otp,
    });
    return reposne.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errMessage =
        error.response?.data.message || "otp verification failed";
      throw new Error(errMessage);
    }
    throw new Error((error as Error).message);
  }
};
export const resendOtp = async (email: string): Promise<void> => {
  const response = await axiosInstance.post("/tutor/resendOtp", { email });
  return response.data;
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/tutor/login", {
      email,
      password,
    });
    const { token } = response.data;
    if (token) {
      store.dispatch(
        tutorLoginSuccess({
          token,
          tutor: response.data.tutor,
          isAuthenticated: true,
        })
      );
      // console.log('tutorrrr', response.data?.tutor);
      Cookies.set("tutorAuthToken", token, { expires: 15 / 1440 });
    } else {
      console.log("not logged in");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const validationErrors = error.response?.data.errors; // Extract validation errors
      if (validationErrors) {
        const errorMessage = validationErrors
          .map((err: any) => err.msg)
          .join(", ");
        throw new Error(errorMessage); // Join all validation messages into a single string
      }
      const errMessage = error.response?.data.message || "something went wrong";
      throw new Error(errMessage);
    }
    throw new Error((error as Error).message);
  }
};

export const resetPassword = async (
  token: string | undefined,
  newPassword: string,
  confirmPassword: string
) => {
  await axiosInstance.post("/tutor/resetPassword", {
    token,
    newPassword,
    confirmPassword,
  });
};

export const addCourse = async (formData: FormData) => {
  try {
    // console.log("courseee");

    const response = await axiosInstance.post("tutor/addCourse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("ress gottt",response)
    return response.data;
  } catch (error) {
    console.error("Error adding course:", error);
    throw handleAxiosError(error);
  }
};

export const fetchTutorCourses = async (queryParams: string) => {
  try {
    const response = await axiosInstance.get(
      `/tutor/myCourses/?${queryParams}`
    );
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const getTutorCourseDetails = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/tutor/myCourses/${courseId}`);
    // console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const getCategories = async () => {
  try {
    // console.log("vjhvuj");

    const response = await axiosInstance.get("/categories");
    // console.log(response.data.categories,"mgujfhvhgnvhg ");

    return response.data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw handleAxiosError(error);
  }
};
export const listUnlistCourse = async (
  courseId: string,
  isCurrentlyListed: Boolean
) => {
  try {
    console.log("delete courseee");

    const response = await axiosInstance.patch(
      `/courses/deleteCourse/${courseId}`,
      { isListed: !isCurrentlyListed }
    );
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const listUnlistLecture = async (
  lectureId: string,
  isListed: boolean
) => {
  try {
    const response = await axiosInstance.patch(`/tutor/lecture/${lectureId}`, {
      isListed: !isListed,
    });
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const editCourse = async (courseId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/tutor/editCourse/${courseId}`,
      formData
    );
    return response.data.course;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const editLecture = async (lectureId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/tutor/editLecture/${lectureId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {}
};

export const getCourseDetails = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const getCourseRatings = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/rating/${courseId}`);
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const logoutTutor = async () => {
  try {
    const response = await axiosInstance.post("/tutor/logout");
    // console.log("cameeee repsosne");
    // console.log(response?.data ?? "No response data");

    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const editTutorProfile = async (
  tutorId: string,
  name: string,
  title: string,
  bio: string
) => {
  try {
    const response = await axiosInstance.put(`/tutor/editProfile/${tutorId}`, {
      name,
      title,
      bio,
    });
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const tutorChangePassword = async (
  tutorId: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await axiosInstance.put(
      `/tutor/updatePassword/${tutorId}`,
      { currentPassword, newPassword }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error changing password:", error.response?.data?.message);
    throw new Error(
      error.response?.data?.message || "Failed to change password"
    );
  }
};

export const approvedCount = async (tutorId: string) => {
  try {
    const response = await axiosInstance.get(`/tutor/approved/${tutorId}`);
    // console.log(response,"\\");
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const pendingCount = async (tutorId: string) => {
  try {
    const response = await axiosInstance.get(`/tutor/pending/${tutorId}`);
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const fetchTutorEnrollments = async () => {
  try {
    const response = await axiosInstance.get("/tutor/stats");
    return response.data.enrollments;
  } catch (error) {
    console.error("Error fetching tutor enrollments:", error);
    throw handleAxiosError(error);
  }
};

export const getEnrollmentCount = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/enrollment/${courseId}`);
    const data = response.data;
    // console.log(data.count)
    return data.count;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const getMyStudents = async () => {
  try {
    // console.log("ppppppppppp");

    const response = await axiosInstance.get("/tutor/myStudents", {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const getStudentById = async (studentId: string) => {
  try {
    const response = await axiosInstance.get(`/tutor/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const getTutorMessages = async (
  senderId: string,
  recipientId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/messages/${senderId}/${recipientId}`
    );
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const uploadTutorMessageFile = async (
  formData: FormData,
  fileType: "image" | "video"
) => {
  try {
    const endPoint = fileType === "image" ? "/uploadImage" : "/uploadVideo";
    const response = await axiosInstance.post(endPoint, formData);
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const tutorAmount = async (tutorId: string) => {
  try {
    const response = await axiosInstance.get(`/payments/tutors/${tutorId}`);
    return response.data;
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
  }
};

export const tutorRevenue = async(tutorId:string)=>{
  try {
    const response = await axiosInstance.get(`/payments/total/${tutorId}`)
    return response.data
  } catch (error) {
    console.log("error is", error);
    throw handleAxiosError(error);
    
  }
}
