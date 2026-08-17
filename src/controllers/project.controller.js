import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectmember.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    {
      $project: {
        project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: userRolesEnum.ADMIN,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project created Successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated Successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted Successfully"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
    const {email,role} = req.body
    const { projectId } = req.params;
    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    await ProjectMember.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId)
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role: role
        },
        {
            new: true,
            upsert: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project member added successfully"));


});

const getProjectMembers = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404,"project not found")
    }

    const projectMembers = await ProjectMember.aggregate([
        {
            $match:{
                project: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as:"user",
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
                user: {
                    $arrayElemAt: ["$user", 0]
                }
            }
        },
        {
            $project: {
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, projectMembers, "Project member fetched successfully"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params
    const {newRole} = req.body

    if(!AvailableUserRole.includes(newRole)){
        throw new ApiError(400, "Invalid Role")
    }

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId),
    })

    if(!projectMember){
        throw new ApiError(404, "Project member not found")
    }

    // Project Admin cannot change an Admin's role
    if (projectMember.role === userRolesEnum.ADMIN && req.user.role !== userRolesEnum.ADMIN) {
        throw new ApiError(403, "Project admin cannot change an admin's role")
    }

    // Only Admin can promote members to Admin
    if (newRole === userRolesEnum.ADMIN && req.user.role !== userRolesEnum.ADMIN) {
        throw new ApiError(403, "Only an admin can assign the admin role")
    }

    projectMember = await ProjectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role: newRole
        },
        {
            returnDocument: 'after',
            new: true
        }
    )

    if(!projectMember){
        throw new ApiError(404, "Project member not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, projectMember, "Project member role updated successfully"));

});

const deleteMember = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId),
    })

    if(!projectMember){
        throw new ApiError(404, "Project member not found")
    }

    // Project Admin cannot delete/remove an Admin
    if (projectMember.role === userRolesEnum.ADMIN && req.user.role !== userRolesEnum.ADMIN) {
        throw new ApiError(403, "Project admin cannot remove an admin from the project")
    }

    projectMember = await ProjectMember.findByIdAndDelete(projectMember._id)

    if(!projectMember){
        throw new ApiError(404, "Project member not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, projectMember, "Project member deleted successfully"));
});

export {
  getProjects,
  createProject,
  getProjectById,
  getProjectMembers,
  deleteProject,
  addMembersToProject,
  updateMemberRole,
  updateProject,
  deleteMember,
};
