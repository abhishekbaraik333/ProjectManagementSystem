import { body } from "express-validator";

const userRegisterValidator = () =>{
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
        body("username")
        .trim()
        .isEmpty()
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

export {
    userRegisterValidator,
    userLoginValidator
}