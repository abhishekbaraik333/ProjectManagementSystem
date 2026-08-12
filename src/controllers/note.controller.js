import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectNote } from "../models/note.model.js";
import { Task } from "../models/task.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const getNotes = asyncHandler(async(req,res)=> {
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404, "Project not found")
    }

    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId),
    })

    return res.status(200)
              .json(new ApiResponse(200, notes, "Notes fetched successfully"))
})

const getNoteById = asyncHandler(async(req,res)=>{
    const {noteId, projectId} = req.params
    const note = await ProjectNote.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        _id: noteId
    })

    if(!note){
        throw new ApiError(404, "Note not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, note, "Note fetched successfully"))
})

const createNote = asyncHandler(async (req,res)=>{
    const {content} = req.body
    const {projectId} = req.params

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404, "project not found")
    }

    const createdNote = await ProjectNote.create({
        content,
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: req.user._id
    })

     return res.status(200)
    .json(new ApiResponse(200, createdNote, "Note created successfully"))

})

const updateNote = asyncHandler(async(req,res) => {
    const { noteId, projectId } = req.params
    const { content } = req.body

    // PRODUCTION PATTERN: Ownership Check
    // A note can only be updated by the person who created it.
    // We combine relational security (project) + ownership (createdBy) in one query.
    const note = await ProjectNote.findOne({
        _id: noteId,
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: req.user._id
    })

    if(!note){
        throw new ApiError(404, "Note not found or you are not allowed to update it")
    }

    const updatedNote = await ProjectNote.findOneAndUpdate(
        {
            _id: noteId,
            project: new mongoose.Types.ObjectId(projectId),
            createdBy: req.user._id
        },
        { $set: { content } },
        { new: true }
    )

    return res.status(200)
              .json(new ApiResponse(200, updatedNote, "Note updated successfully"))
})

const deleteNote = asyncHandler(async(req,res) => {
    const { noteId, projectId } = req.params

    // PRODUCTION PATTERN: Ownership Check
    // Only the creator of the note can delete it, not even a project admin.
    const note = await ProjectNote.findOne({
        _id: noteId,
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: req.user._id
    })

    if(!note){
        throw new ApiError(404, "Note not found or you are not allowed to delete it")
    }

    const deletedNote = await ProjectNote.findOneAndDelete({
        _id: noteId,
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: req.user._id
    })

    return res.status(200)
              .json(new ApiResponse(200, deletedNote, "Note deleted successfully"))
})

export {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
}