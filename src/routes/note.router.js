import { Router } from "express";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";
import { validate } from "../middlewares/validator.middleware.js";
import {createNoteValidator} from '../validators/index.js'
import {getNotes, getNoteById, createNote, updateNote, deleteNote} from '../controllers/note.controller.js'

const router = Router()
router.use(verifyJWT);

router.route("/:projectId")
      .get(validateProjectPermission(AvailableUserRole), getNotes)
      .post(validateProjectPermission(AvailableUserRole), createNoteValidator(), validate, createNote)

router.route("/:projectId/:noteId")
      .get(validateProjectPermission(AvailableUserRole), getNoteById)
      .put(validateProjectPermission(AvailableUserRole), updateNote)
      .delete(validateProjectPermission(AvailableUserRole), deleteNote)

export default router;