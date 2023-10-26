import { CustomGraphQLError } from "../utils/customErrorHandler";
import { LoggedUserModel } from "../models/AuthUser";
import { applicant_records } from '../models/candidateApplication';
import { formModel } from '../models/formsModel';
import { jobModels } from '../models/jobModels';

// admin or superadmin list all applications
export const adminViewApplicationsResolvers = {
  Query: {
    adminViewSingleApplication: async (_: any, { applicationId }: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError("You must be logged in to view applications.");
        }

        const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate("role");

        if (
          !userWithRole ||
          ((userWithRole.role as any)?.roleName !== "admin" &&
            (userWithRole.role as any)?.roleName !== "superAdmin")
        ) {
          throw new CustomGraphQLError("You do not have permission to perform this action");
        }

        const application = await applicant_records.findById(applicationId);

        if (!application) {
          throw new CustomGraphQLError("Application not found");
        }

        const form = await formModel.findOne({ link: application.formUrl });

        if (!form) {
          throw new CustomGraphQLError("Form data not found for this application");
        }

        const jobpostInfo = await jobModels.findById(form.jobpost)
          .populate('cohort')
          .populate('cycle')
          .populate('program');

        const associatedFormData = {
          _id: form._id,
          title: form.title,
          description: form.description,
          link: form.link,
          jobpost: jobpostInfo,
        };

        const applicationData = {
          _id: application._id,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          telephone: application.telephone,
          resume: application.resume,
          comments: application.comments,
          address: application.address,
          status: application.status,
          gender: application.gender,
          dateOfSubmission: application.dateOfSubmission,
          availability_for_interview: application.availability_for_interview,
          formUrl: application.formUrl,
          associatedFormData: associatedFormData,
        };

        return applicationData;
      } catch (error: any) {
        throw new CustomGraphQLError(`Failed to retrieve the application: ${error.message}`);
      }
    },
    adminViewApplications: async (_: any, { page, pageSize, searchParams }: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError("You must be logged in to view applications.");
        }

        const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate("role");

        if (
          !userWithRole ||
          ((userWithRole.role as any)?.roleName !== "admin" &&
            (userWithRole.role as any)?.roleName !== "superAdmin")
        ) {
          throw new CustomGraphQLError("You do not have permission to perform this action");
        }

        const query: any = { ...searchParams };
        const skip = page ? (page - 1) * pageSize : 0;

        if (searchParams?.applicationStatus) query.status = searchParams.applicationStatus;
        if (searchParams?.gender) query.gender = searchParams.gender;

        if (searchParams?.jobAppliedFor) {
          const formWithJob = await formModel.findOne({ jobpost: searchParams.jobAppliedFor });
          if (formWithJob) query.formUrl = formWithJob.link;
          else {
            return {
              applications: [],
              totalApplications: 0,
              status: 200,
              message: "No applications found for the specified jobAppliedFor."
            };
          }
        }

        if (searchParams?.cohort) {
          const cohortWithId = await jobModels.findOne({ cohort: searchParams.cohort });
          if (cohortWithId) {
            const formsInCohort = await formModel.find({ jobpost: cohortWithId._id });
            if (formsInCohort.length > 0) {
              const formLinks = formsInCohort.map((form) => form.link);
              query.formUrl = { $in: formLinks };
            }
          } else {
            return {
              applications: [],
              totalApplications: 0,
              status: 200,
              message: "No applications found for the specified cohort."
            };
          }
        }

        if (searchParams?.cycle) {
            const cycleWithId = await jobModels.findOne({ cycle: searchParams.cycle });
        
            if (cycleWithId) {
                const formsInCycle = await formModel.find({ jobpost: cycleWithId._id });
        
                if (formsInCycle.length > 0) {
                    const formLinks = formsInCycle.map((form) => form.link);
                    query.formUrl = { $in: formLinks };
                } 
            } else {
                return {
                    applications: [],
                    totalApplications: 0,
                    status: 200,
                    message: "No applications found for the specified cycle."
                };
            }
        }

        if (searchParams?.programAppliedFor) {
            const programWithId = await jobModels.findOne({ program: searchParams.programAppliedFor });
            
            if (programWithId) {
                const formsWithProgram = await formModel.find({ program: programWithId._id });
            
                if (formsWithProgram.length > 0) {
                    const formLinks = formsWithProgram.map((form) => form.link);
                    query.formUrl = { $in: formLinks };
                } 
            } else {
                return {
                    applications: [],
                    totalApplications: 0,
                    status: 200,
                    message: "No applications found for the specified programAppliedFor."
                };
            }
        }

        const applications = await applicant_records.find(query).skip(skip).limit(pageSize);
        
        const filteredApplications = [];

        for (const application of applications) {
          const form = await formModel.findOne({ link: application.formUrl });

          if (form) {
            const jobpostInfo = await jobModels.findById(form.jobpost)
              .populate('cohort')
              .populate('cycle')
              .populate('program');

            const associatedFormData = {
              _id: form._id,
              title: form.title,
              description: form.description,
              link: form.link,
              jobpost: jobpostInfo,
            };

            filteredApplications.push({
              _id: application._id,
              firstName: application.firstName,
              lastName: application.lastName,
              email: application.email,
              telephone: application.telephone,
              resume: application.resume,
              comments: application.comments,
              address: application.address,
              status: application.status,
              gender: application.gender,
              dateOfSubmission: application.dateOfSubmission,
              availability_for_interview: application.availability_for_interview,
              formUrl: application.formUrl,
              associatedFormData: associatedFormData,
            });
          }
        }

        const totalApplications = filteredApplications.length;

        const response = {
          applications: filteredApplications,
          totalApplications,
          status: 200,
          message: "Success! All applications retrieved"
        };

        return response;
      } catch (error: any) {
        throw new CustomGraphQLError(`Failed to retrieve applications: ${error.message}`);
      }
    },
  },

  Mutation: {
    adminUpdateApplicationStatus: async (_: any, { applicationId, newStatus }: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError("You must be logged in to update application status.");
        }
  
        const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate("role");
  
        if (
          !userWithRole ||
          ((userWithRole.role as any)?.roleName !== "admin" &&
            (userWithRole.role as any)?.roleName !== "superAdmin")
        ) {
          throw new CustomGraphQLError("You do not have permission to perform this action");
        }
  
        const application = await applicant_records.findById(applicationId);
  
        if (!application) {
          throw new CustomGraphQLError("Application not found");
        }
  
        const form = await formModel.findOne({ link: application.formUrl });
  
        if (!form) {
          throw new CustomGraphQLError("Form data not found for this application");
        }
  
        const jobpostInfo = await jobModels.findById(form.jobpost)
          .populate('cohort')
          .populate('cycle')
          .populate('program');
  
        const associatedFormData = {
          _id: form._id,
          title: form.title,
          description: form.description,
          link: form.link,
          jobpost: jobpostInfo,
        };
  
        application.status = newStatus;
        await application.save();
  
        return {
          _id: application._id,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          telephone: application.telephone,
          resume: application.resume,
          comments: application.comments,
          address: application.address,
          status: application.status, // Updated status
          gender: application.gender,
          dateOfSubmission: application.dateOfSubmission,
          availability_for_interview: application.availability_for_interview,
          formUrl: application.formUrl,
          associatedFormData: associatedFormData, // Include associatedFormData
        };
      } catch (error: any) {
        throw new CustomGraphQLError(`Failed to update application status: ${error.message}`);
      }
    },
  },
  
};
