import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { SubTask } from "../models/subtask.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { mongo } from "mongoose";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async(req,res) =>{
    const {projectId} = req.params
    const project = await Project.findById(projectId)
    if(!project){
        throw new ApiError(404,"Project not found")
    }

   const tasks =  await Task.find({
        project:new mongoose.Types.ObjectId(projectId)
    }).populate("assignedTo", "avatar username fullName")

    return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"))
})

const getTaskById = asyncHandler(async(req,res) =>{
    const {taskId} = req.params

    const task = await Task.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "assignedTo",
                foreignField:"_id",
                as: "assignedTo",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            username:1,
                            fullName:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"subtasks",
                localField:"_id",
                foreignField: "task",
                as:"subtasks",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"createdBy",
                            foreignField: "_id",
                            as:"createdBy",
                            pipeline:[
                                {
                                    $project:{
                                        _id:1,
                                        username:1,
                                        fullName:1,
                                        avatar:1
                                    }
                                }
                            ]
                           
                        }
                    },
                    {
                        $addFields:{
                            createdBy:{
                                $arrayElemAt: ["$createdBy", 0]
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                assignedTo:{
                    $arrayElemAt:["$assignedTo", 0]
                }
            }
        }
    ])

    if(!task ||task.length === 0){
        throw new ApiError(404, "Tasks not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,task, "Task fetched sucessfully"))
})

const createTask = asyncHandler(async(req,res) =>{
    const {title, description, assignedTo, status} = req.body
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404,"Project not found")
    }

    const files = req.files || []

    const attachments = files.map((file) =>{
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimeType: file.mimetype,
            size: file.size
        }
    })

    const task = await Task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo): undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachments
    })

    return res
        .status(200)
        .json(new ApiResponse(200,task, "Task created successfully"))

})

const updateTask = asyncHandler(async(req,res) =>{
    const {taskId} = req.params
    const {title, description, assignedTo, status} = req.body

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404, "Task not found")
    }

    const files = req.files || []
    const newAttachments = files.map((file) =>{
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                ...(assignedTo && { assignedTo: new mongoose.Types.ObjectId(assignedTo) }),
                ...(status && { status })
            },
            $push: {
                attachments: { $each: newAttachments }
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task updated successfully"))
})
const deleteTask = asyncHandler(async(req,res) =>{
    const {taskId} = req.params

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404, "Task not found")
    }

    // PRODUCTION PATTERN: Cascade Deletion
    // When a task is deleted, wipe all of its subtasks from the database
    await SubTask.deleteMany({ task: taskId })

    // (Optional but recommended in production): Wipe files from cloud storage
    // if (task.attachments && task.attachments.length > 0) {
    //     await deleteFilesFromCloud(task.attachments.map(att => att.url))
    // }

    const deletedTask = await Task.findByIdAndDelete(taskId)

    return res.status(200)
              .json(new ApiResponse(200, deletedTask, "Task deleted successfully"))  

})
const createSubTask = asyncHandler(async(req,res) =>{
    const {title, isCompleted} = req.body
    const {taskId} = req.params

    const parentTask = await Task.findById(taskId)

    if(!parentTask){
        throw new ApiError(404, "Task not found")
    }

    const subtask = await SubTask.create({
        title,
        task: new mongoose.Types.ObjectId(taskId),
        isCompleted,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
    })

    return res.status(200)
              .json(new ApiResponse(200, subtask, "Subtask created successfully"))
})

const updateSubTask = asyncHandler(async(req,res) =>{
    const { taskId, subTaskId } = req.params
    const { title, isCompleted } = req.body

    // PRODUCTION PATTERN: Relational Security
    // Ensure the subtask not only exists, but actually belongs to the specified task in the URL
    const subTask = await SubTask.findOne({ _id: subTaskId, task: taskId })

    if(!subTask){
        throw new ApiError(404, "SubTask not found or doesn't belong to this task")
    }

    const updatedSubTask = await SubTask.findOneAndUpdate(
        { _id: subTaskId, task: taskId },
        {
            $set: {
                ...(title && { title }),
                ...(isCompleted !== undefined && { isCompleted }),
            },
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedSubTask, "SubTask updated successfully"))
})

const deleteSubTask = asyncHandler(async(req,res) =>{
    const { taskId, subTaskId } = req.params

    // PRODUCTION PATTERN: Relational Security
    // Prevents an attacker from deleting a subtask from someone else's project
    const subTask = await SubTask.findOne({ _id: subTaskId, task: taskId })

    if(!subTask){
        throw new ApiError(404, "SubTask not found or doesn't belong to this task")
    }

    const deletedSubTask = await SubTask.findOneAndDelete({ _id: subTaskId, task: taskId })

    return res.status(200)
              .json(new ApiResponse(200, deletedSubTask, "SubTask deleted successfully"))  

})

export {
    getTasks,
    getTaskById,
    createTask,
    deleteTask,
    updateTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
}
