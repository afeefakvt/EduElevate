import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { VALIDATION_MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/httpStatusCode";



export const validateStudentRegistration = [
    body("name")
        .notEmpty().withMessage(VALIDATION_MESSAGES.NAME_REQUIRED)
        .isLength({ min: 3 }).withMessage(VALIDATION_MESSAGES.NAME_MIN_LENGTH)
        .trim(),

    
    body("email")
        .isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
        .matches(/[0-9]/).withMessage(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_NUMBER)
        .trim(),

    // body("confirmPassword")
    //     .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    //     .matches(/[0-9]/).withMessage("Password must contain at least one number")
    //     .trim(),


    // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
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
        .notEmpty().withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail(),

    // Password Validation
    body("password")
        .notEmpty().withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
        // .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             res.status(HTTP_STATUS.BAD_REQUEST).json({
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
        .notEmpty().withMessage(VALIDATION_MESSAGES.NAME_REQUIRED)
        .isLength({ min: 3 }).withMessage(VALIDATION_MESSAGES.NAME_MIN_LENGTH)
        .trim(),

    body("email")
        .isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
        .matches(/[0-9]/).withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
        .trim(),

    body("title").notEmpty().withMessage(VALIDATION_MESSAGES.TITLE_REQUIRED),

    body("bio")
        .notEmpty().withMessage(VALIDATION_MESSAGES.BIO_REQUIRED)
        .isLength({ min: 3 }).withMessage(VALIDATION_MESSAGES.BIO_MIN_LENGTH)
        .trim(),

    // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             res.status(HTTP_STATUS.BAD_REQUEST).json({
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
        .notEmpty().withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail(),

    // Password Validation
    body("password")
        .notEmpty().withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
        // .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             res.status(HTTP_STATUS.BAD_REQUEST).json({
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
      .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
      .matches(/[0-9]/)
      .withMessage(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_NUMBER)
      // .matches(/[a-zA-Z]/).withMessage('Password must contain a letter')
      .trim(),
    body("confirmPassword")
      .isLength({ min: 6 })
      .withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
      .matches(/[0-9]/)
      .withMessage(VALIDATION_MESSAGES.PASSWORD_MUST_CONTAIN_NUMBER)
      // .matches(/[a-zA-Z]/).withMessage('Password must contain a letter')
      .trim(),

       // Error Handling Middleware
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                errors: errors.array(),
            });
            return;
        }
        next();
    },
  ];