import { Router } from "express";
import {getTasks,getTaskById,createTask,updateTask,deleteTask, createSubTask, updateSubTask, deleteSubTask} from '../controllers/task.controller.js'
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createTaskValidator, updateTaskValidator, createSubTaskValidator, updateSubTaskValidator } from "../validators/index.js";

const router = Router()
router.use(verifyJWT);

router.route("/:projectId")
      .get(validateProjectPermission(AvailableUserRole),getTasks)
      .post(validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]), upload.array("attachments"), createTaskValidator(), validate, createTask)

router.route("/:projectId/:taskId")
      .get(validateProjectPermission(AvailableUserRole), getTaskById)
      .put(validateProjectPermission(AvailableUserRole), upload.array("attachments"), updateTaskValidator(), validate, updateTask)
      .delete(validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]), deleteTask)

router.route("/:projectId/:taskId/subtasks")
      .post(validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]), createSubTaskValidator(), validate, createSubTask)

router.route("/:projectId/:taskId/subtasks/:subTaskId")
      .put(validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]), updateSubTaskValidator(), validate, updateSubTask)
      .delete(validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]), deleteSubTask)

export default router;