import { AuthenticationError } from 'apollo-server';
import JobApplication from '../models/JobApplication'
import applicationCycleResolver from './applicationCycleResolver';
import { CustomGraphQLError } from '../utils/customErrorHandler';
import { LoggedUserModel } from '../models/AuthUser';
import { jobModels } from '../models/jobModels';

interface formData {
    traineeId: string,
    jobId: string,
    essay: string,
    resume: string
}

interface getOneFormData {
    applicationId: string
}

interface statusData {
    applicationId: string,
    status: string,
    comment: string
}

const formatDate = (date:Date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

export const jobApplicationResolver = {
    Query: {
        getOwnJobApplications: async (_:any, { input }:{input: formData}, cxt:any) => {
            if (!cxt.currentUser) {
                throw new AuthenticationError('You must be logged in');
            }

            const userId = cxt.currentUser._id

            const applications = await JobApplication.find({userId})
            .populate('jobId')

            return applications.map(application => {
                return {
                    _id: application._id,
                    userId: application.userId,
                    essay: application.essay,
                    resume: application.resume,
                    status: application.status,
                    jobId: application.jobId,
                    createdAt: formatDate(application.createdAt)
                }
            })
        },
        getAllJobApplications: async (_:any, { input }:{input: formData}, cxt:any) => {
            if (!cxt.currentUser) {
                throw new AuthenticationError('You must be logged in');
            }

            const userWithRole = await LoggedUserModel.findById(
				cxt.currentUser?._id
			).populate("role");

			if (
				!userWithRole ||
				((userWithRole.role as any)?.roleName !== "admin" &&
					(userWithRole.role as any)?.roleName !== "superAdmin")
			) {
				throw new CustomGraphQLError(
					"You do not have permission to perform this action"
				);
			}

            const applications = await JobApplication.find().populate('jobId').populate('userId')
            return applications.map(application => {
                return {
                    _id: application._id,
                    userId: application.userId,
                    essay: application.essay,
                    resume: application.resume,
                    status: application.status,
                    jobId: application.jobId,
                    createdAt: formatDate(application.createdAt)
                }
            })
        },
        getOneJobApplication: async (_:any, { input }:{input: getOneFormData}, cxt:any) => {
            if (!cxt.currentUser) {
                throw new AuthenticationError('You must be logged in');
            }

            const userWithRole = await LoggedUserModel.findById(
				cxt.currentUser?._id
			).populate("role");

			if (
				!userWithRole ||
				((userWithRole.role as any)?.roleName !== "admin" &&
					(userWithRole.role as any)?.roleName !== "superAdmin")
			) {
				throw new CustomGraphQLError(
					"You do not have permission to perform this action"
				);
			}

            const application = await JobApplication.findOne({_id: input.applicationId}).populate('jobId').populate('userId')
            if(!application){
                throw new Error('Application not found');
            }
            
            return {
                _id: application._id,
                userId: application.userId,
                essay: application.essay,
                resume: application.resume,
                status: application.status,
                comment: application.comment,
                jobId: application.jobId,
                createdAt: formatDate(application.createdAt)
            }
        },
        checkIfUserApplied: async (_: any, args: any, cxt: any) => {
			if (!cxt.currentUser) {
                throw new AuthenticationError('You must be logged in');
            }

            const application = await JobApplication.findOne({userId: cxt.currentUser._id, jobId: args.input.jobId})
            return {
                status: application ? true : false
            }
		}
    },
    Mutation: {
        createNewJobApplication: async (_:any, { input }:{input: formData}, cxt:any) => {
            if (!cxt.currentUser) {
                throw new AuthenticationError('You must be logged in');
            }

            const userId = cxt.currentUser._id
            
            const { jobId, essay, resume } = input;

            const existingApplication = await JobApplication.findOne({userId, jobId})
            if(existingApplication){
                throw new Error('Application already exists');
            }

            const jobApplication = new JobApplication({
                userId,
                jobId,
                essay,
                resume,
            });


            const savedApplication = await jobApplication.save();

            return savedApplication;
        },
        changeApplicationStatus: async (_:any, { input }:{input: statusData}, cxt:any) => {
            if (!cxt.currentUser) {
                throw new AuthenticationError('You must be logged in');
            }

            const userWithRole = await LoggedUserModel.findById(
				cxt.currentUser?._id
			).populate("role");

			if (
				!userWithRole ||
				((userWithRole.role as any)?.roleName !== "admin" &&
					(userWithRole.role as any)?.roleName !== "superAdmin")
			) {
				throw new CustomGraphQLError(
					"You do not have permission to perform this action"
				);
			}

            const { status, applicationId, comment } = input
            if(comment){
                await JobApplication.findByIdAndUpdate(applicationId, {status, comment})
            }else{
                await JobApplication.findByIdAndUpdate(applicationId, {status})
            }
           
            const application = await JobApplication.findOne({_id:applicationId}).populate('userId').populate('jobId')
            if(!application){
                throw new Error('Application not found');
            }
            
            return {
                _id: application._id,
                userId: application.userId,
                essay: application.essay,
                resume: application.resume,
                status: application.status,
                comment: application.comment,
                jobId: application.jobId,
                createdAt: formatDate(application.createdAt)
            }
        } 
    },
};