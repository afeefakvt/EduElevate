import { ERROR_MESSAGES } from "@/constants/messages";

export const validateLoginForm = (email: string, password: string) => {
    const errors: { email?: string; password?: string } = {};
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      errors.email = ERROR_MESSAGES.REQUIRED.EMAIL
    } else if (!emailRegex.test(email)) {
      errors.email = ERROR_MESSAGES.INVALID.EMAIL
    }
  
    // Validate password (e.g., minimum 6 characters)
    if (!password) {
      errors.password = ERROR_MESSAGES.REQUIRED.PASSWORD
    } else if (password.length < 6) {
      errors.password = ERROR_MESSAGES.INVALID.PASSWORD_LENGTH
    }
  
    return errors;
  };


  export const validateRegisterForm = (name: string, email: string, password: string,confirmPassword:string, title: string, bio: string) => {
    const errors: { name?: string; email?: string; password?: string; confirmPassword?:string; title?: string; bio?: string } = {};
  
    if (!name.trim()) {
      errors.name = ERROR_MESSAGES.REQUIRED.NAME
    }
  
    if (!email.trim()) {
      errors.email = ERROR_MESSAGES.REQUIRED.EMAIL
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email)) {
      errors.email = ERROR_MESSAGES.INVALID.EMAIL
    }
  
    if (!password) {
      errors.password = ERROR_MESSAGES.REQUIRED.PASSWORD
    } else if (password.length < 6) {
      errors.password = ERROR_MESSAGES.INVALID.PASSWORD_LENGTH
    }
    if (!confirmPassword) {
      errors.confirmPassword = ERROR_MESSAGES.REQUIRED.CONFIRM_PASSWORD
    } else if (confirmPassword.length < 6) {
      errors.confirmPassword = ERROR_MESSAGES.INVALID.PASSWORD_LENGTH
    }else if(confirmPassword!==password){
      errors.confirmPassword = ERROR_MESSAGES.INVALID.PASSWORD_MATCH
    }
  
    if (!title.trim()) {
      errors.title = ERROR_MESSAGES.REQUIRED.TITLE
    }else if(typeof title!== 'string'){
        errors.title = ERROR_MESSAGES.INVALID.TITLE
    }
  
    if (!bio.trim()) {
      errors.bio = ERROR_MESSAGES.REQUIRED.BIO
    }else if(typeof bio !== 'string'){
        errors.bio = ERROR_MESSAGES.INVALID.BIO
    }
  
    return errors;
  };
  

  export const validateStudentRegisterForm = (name: string, email: string, password: string, confirmPassword: string) => {
    let errors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

    if (!name.trim()) {
        errors.name = ERROR_MESSAGES.REQUIRED.NAME
    }

    if (!email.trim()) {
        errors.email = ERROR_MESSAGES.REQUIRED.EMAIL
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = ERROR_MESSAGES.INVALID.EMAIL
    }

    if (!password.trim()) {
        errors.password =ERROR_MESSAGES.REQUIRED.PASSWORD
    } else if (password.length < 6) {
        errors.password = ERROR_MESSAGES.INVALID.PASSWORD_LENGTH
    }

    if (!confirmPassword.trim()) {
        errors.confirmPassword = ERROR_MESSAGES.REQUIRED.CONFIRM_PASSWORD
    } else if (confirmPassword !== password) {
        errors.confirmPassword = ERROR_MESSAGES.INVALID.PASSWORD_MATCH
    }

    return errors;
};


export const validateResetPasswordForm = ( password: string, confirmPassword: string) => {
  let errors: {  password?: string; confirmPassword?: string } = {};


  if (!password.trim()) {
      errors.password = ERROR_MESSAGES.REQUIRED.PASSWORD
  } else if (password.length < 6) {
      errors.password = ERROR_MESSAGES.INVALID.PASSWORD_LENGTH
  }

  if (!confirmPassword.trim()) {
      errors.confirmPassword = ERROR_MESSAGES.REQUIRED.CONFIRM_PASSWORD
  } else if (confirmPassword !== password) {
      errors.confirmPassword = ERROR_MESSAGES.INVALID.PASSWORD_MATCH
  }

  return errors;
};



  export const validateAddCourseForm = (formData: { 
    title: string;
    description: string;
    categoryId: string;
    price: number;
    duration: string;
    thumbnail: File | null;
  }) => {


    const errors: { 
      title?: string; 
      description?: string;  
      categoryId?: string; 
      price?: string; 
      duration?: string; 
      thumbnail?: string;
    } = {};

    if (!formData.title.trim()) {
      errors.title = ERROR_MESSAGES.REQUIRED.TITLE
    } else if (typeof formData.title !== "string") {
      errors.title = ERROR_MESSAGES.INVALID.TITLE
    }

    if (!formData.description.trim()) {
      errors.description = ERROR_MESSAGES.REQUIRED.DESCRIPTION
    } else if (typeof formData.description !== "string") {
      errors.description = "Description should be valid characters.";
    } else if (formData.description.length < 10) {
      errors.description = ERROR_MESSAGES.INVALID.DESCRIPTION
    }

    if (!formData.categoryId.trim()) {
      errors.categoryId = ERROR_MESSAGES.REQUIRED.CATEGORY
    } 

    if (!formData.price) {
      errors.price = ERROR_MESSAGES.REQUIRED.PRICE
    } else if (typeof formData.price !== "number" || formData.price < 0) {
      errors.price = ERROR_MESSAGES.INVALID.PRICE
    }

    if (!formData.duration.trim()) {
      errors.duration = ERROR_MESSAGES.REQUIRED.DURATION
    } else if (!/^\d+\s*(hours?|days?|weeks?|months?)$/i.test(formData.duration)) {
      errors.duration = ERROR_MESSAGES.INVALID.DURATION
    }

    if (!formData.thumbnail) {
      errors.thumbnail = ERROR_MESSAGES.REQUIRED.THUMBNAIL;
    } else if (typeof formData.thumbnail === 'string') {
      // If thumbnail is a URL, no need to validate type or size
    } else if (formData.thumbnail instanceof File) {
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(formData.thumbnail.type)) {
        errors.thumbnail = ERROR_MESSAGES.INVALID.THUMBNAIL_FORMAT;
      }
      if (formData.thumbnail.size > 5 * 1024 * 1024) {
        errors.thumbnail = ERROR_MESSAGES.INVALID.THUMBNAIL_SIZE;
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

  if (!lectureData.title.trim()) {
    errors.title = ERROR_MESSAGES.REQUIRED.TITLE
  } else if (typeof lectureData.title !== "string") {
    errors.title = ERROR_MESSAGES.INVALID.TITLE
  }

  if (!lectureData.description.trim()) {
    errors.description = ERROR_MESSAGES.REQUIRED.DESCRIPTION
  } else if (typeof lectureData.description !== "string") {
    errors.description = "Description should be valid characters";
  } else if (lectureData.description.length < 10) {
    errors.description = ERROR_MESSAGES.INVALID.DESCRIPTION
  }

  if (!lectureData.order.trim()) {
    errors.order = ERROR_MESSAGES.REQUIRED.ORDER
  } else if  (isNaN(Number(lectureData.order)) || Number(lectureData.order) < 0) {
    errors.order = ERROR_MESSAGES.INVALID.ORDER
}
  
  const durationRegex = /^(\d{1,2}:)?\d{1,2}:\d{2}$/;

if (!lectureData.duration.trim()) {
  errors.duration = ERROR_MESSAGES.REQUIRED.DURATION
} else if (!durationRegex.test(lectureData.duration)) {
  errors.duration = ERROR_MESSAGES.INVALID.LECTURE_DURATION
}


  if (!lectureData.video) {
    errors.video = ERROR_MESSAGES.REQUIRED.VIDEO
  } else {
    const allowedTypes = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
    if (!allowedTypes.includes(lectureData.video.type)) {
      errors.video = ERROR_MESSAGES.INVALID.VIDEO_FORMAT
    }
    if (lectureData.video.size > 500 * 1024 * 1024) { // 500MB limit
      errors.video = ERROR_MESSAGES.INVALID.VIDEO_SIZE
    }
  }

  return errors;
};


export const validateEditLectureForm = (lectureData: { 
  title?: string;
  description?: string;
  order?: string;
  duration?: string;
  video?: File | null;
}) => {

  const errors: { 
    title?: string; 
    description?: string;  
    order?: string; 
    duration?: string; 
    video?: string;
  } = {};

  if (lectureData.title !== undefined) {
    if (!lectureData.title.trim()) {
      errors.title = ERROR_MESSAGES.REQUIRED.TITLE;
    } else if (typeof lectureData.title !== "string") {
      errors.title = ERROR_MESSAGES.INVALID.TITLE;
    }
  }

  if (lectureData.description !== undefined) {
    if (!lectureData.description.trim()) {
      errors.description = ERROR_MESSAGES.REQUIRED.DESCRIPTION;
    } else if (typeof lectureData.description !== "string") {
      errors.description = "Description should be valid characters";
    } else if (lectureData.description.length < 10) {
      errors.description = ERROR_MESSAGES.INVALID.DESCRIPTION;
    }
  }

  if (lectureData.order !== undefined) {
    if (!lectureData.order.trim()) {
      errors.order = ERROR_MESSAGES.REQUIRED.ORDER;
    } else if (isNaN(Number(lectureData.order)) || Number(lectureData.order) < 0) {
      errors.order = ERROR_MESSAGES.INVALID.ORDER;
    }
  }

  const durationRegex = /^(\d{1,2}:)?\d{1,2}:\d{2}$/;
  
  if (lectureData.duration !== undefined) {
    if (!lectureData.duration.trim()) {
      errors.duration = ERROR_MESSAGES.REQUIRED.DURATION;
    } else if (!durationRegex.test(lectureData.duration)) {
      errors.duration = ERROR_MESSAGES.INVALID.LECTURE_DURATION;
    }
  }

  if (lectureData.video !== undefined) {
    const allowedTypes = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
    if (!lectureData.video) {
      errors.video = ERROR_MESSAGES.REQUIRED.VIDEO;
    } else {
      if (!allowedTypes.includes(lectureData.video.type)) {
        errors.video = ERROR_MESSAGES.INVALID.VIDEO_FORMAT;
      }
      if (lectureData.video.size > 500 * 1024 * 1024) { // 500MB limit
        errors.video = ERROR_MESSAGES.INVALID.VIDEO_SIZE;
      }
    }
  }

  return errors;
};



export const validateTutorEditProfileForm = (name:string,title:string,bio:string)=>{
  let errors : {name?:string,title?:string,bio?:string} = {}
  if(!name.trim()){
    errors.name = ERROR_MESSAGES.REQUIRED.NAME
  }
  if(!title.trim()){
    errors.title = ERROR_MESSAGES.REQUIRED.TITLE
  }
  if(!bio.trim()){
    errors.bio = ERROR_MESSAGES.REQUIRED.BIO
  }
  return errors;
}
export const validateStudentEditProfileForm = (name:string)=>{
  let errors : {name?:string} = {}
  if(!name.trim()){
    errors.name = ERROR_MESSAGES.REQUIRED.NAME
  }
  return errors;
}

export const validateChangePasswordForm = (currentPassword:string,password:string,confirmPassword:string)=>{
  let errors: {  currentPassword?:string,password?: string; confirmPassword?: string } = {};

  if(!currentPassword.trim()){
    errors.currentPassword = ERROR_MESSAGES.REQUIRED.PASSWORD
  }

  if (!password.trim()) {
      errors.password = ERROR_MESSAGES.REQUIRED.PASSWORD
  } else if (password.length < 6) {
      errors.password = ERROR_MESSAGES.INVALID.PASSWORD_LENGTH
  }

  if (!confirmPassword.trim()) {
      errors.confirmPassword = ERROR_MESSAGES.REQUIRED.CONFIRM_PASSWORD
  } else if (confirmPassword !== password) {
      errors.confirmPassword = ERROR_MESSAGES.INVALID.PASSWORD_MATCH
  }

  return errors;
}