import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";



export const validateStudentRegistration = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name should be at least 3 characters long")
        .trim(),

    
    body("email")
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .trim(),

    // body("confirmPassword")
    //     .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    //     .matches(/[0-9]/).withMessage("Password must contain at least one number")
    //     .trim(),


    // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                errors: errors.array(),
            });
            return;
        }
        next();
    },
];



export const validateStudentLogin = [
    // Email Validation
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail(),

    // Password Validation
    body("password")
        .notEmpty().withMessage("Password is required"),
        // .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             res.status(400).json({
                success: false,
                errors: errors.array(),
            });
            return;
        }
        next();
    },
];

export const validateTutorRegistration = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name should be at least 3 characters long")
        .trim(),

    body("email")
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .trim(),

    body("title").notEmpty().withMessage("Title is required"),

    body("bio")
        .notEmpty().withMessage("Bio is required")
        .isLength({ min: 3 }).withMessage("Bio should be at least 3 characters long")
        .trim(),

    // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             res.status(400).json({
                success: false,
                errors: errors.array()
            });
            return;
        }
        next();
    },
];

export const validateTutorLogin = [
    // Email Validation
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail(),

    // Password Validation
    body("password")
        .notEmpty().withMessage("Password is required"),
        // .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             res.status(400).json({
                success: false,
                errors: errors.array(),
            });
            return;
        }
        next();
    },
];


export const validateForgotPassword = [
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password should contain atleast 6 charecters")
      .matches(/[0-9]/)
      .withMessage("Password should contain atleast one number")
      // .matches(/[a-zA-Z]/).withMessage('Password must contain a letter')
      .trim(),
    body("confirmPassword")
      .isLength({ min: 6 })
      .withMessage("Password should contain atleast 6 charecters")
      .matches(/[0-9]/)
      .withMessage("Password should contain atleast one number")
      // .matches(/[a-zA-Z]/).withMessage('Password must contain a letter')
      .trim(),

       // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             res.status(400).json({
                success: false,
                errors: errors.array(),
            });
            return;
        }
        next();
    },
  ];