import { string } from "yup";

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


  export const validateRegisterForm = (name: string, email: string, password: string, title: string, bio: string) => {
    const errors: { name?: string; email?: string; password?: string; title?: string; bio?: string } = {};
  
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
