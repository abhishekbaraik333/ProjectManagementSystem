import {Router} from 'express'
import { changeCurrentPassword, forgotPasswordRequest, getUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetPassword, verifyEmail } from '../controllers/auth.controller.js'
import {validate} from '../middlewares/validator.middleware.js'
import { userLoginValidator, userRegisterValidator } from '../validators/index.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

// unsecured routes
router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,loginUser)
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/refresh-token").get(refreshAccessToken)
router.route("/forgot-password-request").post(forgotPasswordRequest)
router.route("/forgot-password").post(resetPassword)

// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/current-user").get(verifyJWT,getUser)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification)



export default router;