
export const validateLoginForm = (email: string, password: string) => {
    const errors: { email?: string; password?: string } = {};
  
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email format';
    }
  
    // Validate password (e.g., minimum 6 characters)
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  
    return errors;
  };


  export const validateRegisterForm = (name: string, email: string, password: string,confirmPassword:string, title: string, bio: string) => {
    const errors: { name?: string; email?: string; password?: string; confirmPassword?:string; title?: string; bio?: string } = {};
  
    if (!name.trim()) {
      errors.name = "Name is required";
    }
  
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email format";
    }
  
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword.length < 6) {
      errors.confirmPassword = "Password must be at least 6 characters";
    }else if(confirmPassword!==password){
      errors.confirmPassword = "Confirm Password should be same as entered Password"
    }
  
    if (!title.trim()) {
      errors.title = "Title is required";
    }else if(typeof title!== 'string'){
        errors.title = 'Title should be valid characters'
    }
  
    if (!bio.trim()) {
      errors.bio = "Bio is required";
    }else if(typeof bio !== 'string'){
        errors.bio = 'Bio should be valid characters'
    }
  
    return errors;
  };
  

  export const validateStudentRegisterForm = (name: string, email: string, password: string, confirmPassword: string) => {
    let errors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

    if (!name.trim()) {
        errors.name = "Full Name is required";
    }

    if (!email.trim()) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Invalid email format";
    }

    if (!password.trim()) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
        errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};


export const validateResetPasswordForm = ( password: string, confirmPassword: string) => {
  let errors: {  password?: string; confirmPassword?: string } = {};


  if (!password.trim()) {
      errors.password = "Password is required";
  } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
  }

  if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required";
  } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};



  export const validateAddCourseForm = (formData: { 
    title: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    thumbnail: File | null;
  }) => {


    const errors: { 
      title?: string; 
      description?: string;  
      category?: string; 
      price?: string; 
      duration?: string; 
      thumbnail?: string;
    } = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    } else if (typeof formData.title !== "string") {
      errors.title = "Title should be valid characters.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    } else if (typeof formData.description !== "string") {
      errors.description = "Description should be valid characters.";
    } else if (formData.description.length < 10) {
      errors.description = "Description should be at least 10 characters.";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required.";
    } 

    if (!formData.price) {
      errors.price = "Valid Price is required.";
    } else if (typeof formData.price !== "number" || formData.price < 0) {
      errors.price = "Price must be a positive number.";
    }

    if (!formData.duration.trim()) {
      errors.duration = "Duration is required.";
    } else if (!/^\d+\s*(hours?|days?|weeks?|months?)$/i.test(formData.duration)) {
      errors.duration = "Duration should be in a valid format (e.g., '10 hours', '2 weeks'.)";
    }

    if (!formData.thumbnail) {
      errors.thumbnail = "Thumbnail image is required.  ";
    } else {
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(formData.thumbnail.type)) {
        errors.thumbnail = "Thumbnail must be in PNG, JPEG, or WEBP format.";
      }
      if (formData.thumbnail.size > 5 * 1024 * 1024) {
        errors.thumbnail = "Thumbnail size must be less than 5MB.";
      }
    }

    return errors;
  };


export const validateAddLectureForm = (lectureData: { 
  title: string;
  description: string;
  order: string;
  duration: string;
  video: File | null;
}) => {

  const errors: { 
    title?: string; 
    description?: string;  
    order?: string; 
    duration?: string; 
    video?: string;
  } = {};

  // Title Validation
  if (!lectureData.title.trim()) {
    errors.title = "Title is required";
  } else if (typeof lectureData.title !== "string") {
    errors.title = "Title should be valid characters";
  }

  // Description Validation
  if (!lectureData.description.trim()) {
    errors.description = "Description is required";
  } else if (typeof lectureData.description !== "string") {
    errors.description = "Description should be valid characters";
  } else if (lectureData.description.length < 10) {
    errors.description = "Description should be at least 10 characters";
  }

  // Order Validation
  if (!lectureData.order.trim()) {
    errors.order = "Order is required";
  } else if (!/^\d+$/.test(lectureData.order)) {
    errors.order = "Order must be a positive number";
  }

  // Duration Validation
  if (!lectureData.duration.trim()) {
    errors.duration = "Duration is required";
  } else if (!/^(\d+\s*(minutes?|hours?))$/i.test(lectureData.duration)) {
    errors.duration = "Duration should be in a valid format (e.g., '30 minutes', '1 hour')";
  }

  // Video File Validation
  if (!lectureData.video) {
    errors.video = "Lecture video is required";
  } else {
    const allowedTypes = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
    if (!allowedTypes.includes(lectureData.video.type)) {
      errors.video = "Video must be in MP4, MKV, AVI, or MOV format";
    }
    if (lectureData.video.size > 500 * 1024 * 1024) { // 500MB limit
      errors.video = "Video size must be less than 500MB";
    }
  }

  return errors;
};
