import mongoose, { Schema } from "mongoose";
import {taskStatusEnum} from '../utils/constants.js'

const taskSchema = new Schema ({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description: String,
    project:{
        type: Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    assignedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    lastMovedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    lastMovedAt:{
        type: Date
    },
    status:{
        type:String,
        enum: taskStatusEnum,
        default: taskStatusEnum.TODO
    },
    attachments:{
        type:[{
            url:String,
            mimetype:String,
            size: Number
        }],
        default:[]
    }
}, {
    timestamps:true
})

export const Task = mongoose.model("Task", taskSchema)