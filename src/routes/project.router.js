import { Router } from "express";
import {
  getProjects,
  getProjectById,
  getProjectMembers,
  createProject,
  deleteProject,
  updateProject,
  addMembersToProject,
  updateMemberRole,
  deleteMember,
} from "../controllers/project.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  addMemberToProjectValidator,
  createProjectValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getProjectById)
  .put(
    validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(validateProjectPermission([userRolesEnum.ADMIN]), deleteProject);

router
  .route("/:projectId/members")
  .get(validateProjectPermission(AvailableUserRole), getProjectMembers)
  .post(
    validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]),
    addMemberToProjectValidator(),
    validate,
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]), updateMemberRole)
  .delete(validateProjectPermission([userRolesEnum.ADMIN, userRolesEnum.PROJECT_ADMIN]), deleteMember);

export default router;
