import { body } from "express-validator";
import { AvailableUserRole, AvailableTaskStatus } from "../utils/constants.js";


const userRegisterValidator = () =>{
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min:4})
        .withMessage("Username must be of atleast 4 characters"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isStrongPassword()
        .withMessage("Password is weak")
    ]
}

const userLoginValidator = () =>{
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is Invalid")
        .isEmail()
        .withMessage("Email is invalid"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
    ]
}

const createProjectValidator = () =>{
    return [
        body("name")
        .notEmpty()
        .withMessage("Name is required"),
        body("description")
        .optional()
    ]
}

const addMemberToProjectValidator = () => {
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
        body("role")
        .notEmpty()
        .withMessage("role is required")
        .isIn(AvailableUserRole)
        .withMessage("Role is invalid")
    ]
}

const createTaskValidator = () => {
    return [
        body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),
        body("description")
        .optional()
        .trim()
    ]
}

const updateTaskValidator = () => {
    return [
        body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),
        body("description")
        .optional()
        .trim(),
        body("status")
        .optional()
        .isIn(AvailableTaskStatus)
        .withMessage("Invalid task status")
    ]
}

const createSubTaskValidator = () => {
    return [
        body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
    ]
}

const updateSubTaskValidator = () => {
    return [
        body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),
        body("isCompleted")
        .optional()
        .isBoolean()
        .withMessage("isCompleted must be a boolean value")
    ]
}

const createNoteValidator = () => {
    return [
        body("content")
        .trim()
        .notEmpty()
        .withMessage("Note content required")
    ]
}

export {
    userRegisterValidator,
    userLoginValidator,
    createProjectValidator,
    addMemberToProjectValidator,
    createTaskValidator,
    updateTaskValidator,
    createSubTaskValidator,
    updateSubTaskValidator,
    createNoteValidator
}