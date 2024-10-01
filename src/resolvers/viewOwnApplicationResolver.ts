import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { applicant_records } from "../models/candidateApplication";
import { formModel } from '../models/formsModel';
const candidateViewOwnApplication = {
  Query: {
    viewAllOwnApplications: async (_:any, { filter, pagination }:any, context:any) => {
      if (context.sessionExpired) {
        throw new AuthenticationError('Session expired. Please login again to continue.');
      }
      if (!context.currentUser) {
        throw new AuthenticationError('Oops! You must be logged in to proceed');
      }


      try {
        const filterCriteria: any = {
          email: context.currentUser.email,
        };

        if (filter && filter.status) {
          filterCriteria.status = { $in: filter.status };
        }

        const page: number = pagination.page || 1;
        const pageSize: number = pagination.pageSize || 10;
        const skip: number = (page - 1) * pageSize;

        const applications = await applicant_records
          .find(filterCriteria)
          .skip(skip)
          .limit(pageSize)
          .sort({ createdAt: -1 }); // Sort by creation date, newest first

        const applicationList = [];

        for (const application of applications) {
          const associatedForm = application.formUrl
            ? await formModel.findOne({ link: application.formUrl })
            : null;

          const applicationData = {
            _id: application._id,
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
            telephone: application.telephone,
            resume: application.resume,
            address: application.address,
            gender: application.gender,
            availability_for_interview: application.availability_for_interview,
            comments: application.comments,
            status: application.status,
            dateOfSubmission: application.dateOfSubmission,
            formUrl: application.formUrl,
            associatedForm, 
          };

          applicationList.push(applicationData);
        }

        const totalCount = await applicant_records.countDocuments(filterCriteria);

        return {
          message: 'Applications retrieved successfully',
          applications: applicationList,
          totalCount,
        };
      } catch (error) {
        throw new Error('Failed to retrieve applications');
      }
    },

    
    viewOwnApplication: async (_: any, { id }: any, context: any) => {
      if (!context.currentUser) {
        throw new AuthenticationError('You must be logged in to view your application.');
      }

      try {
        const application = await applicant_records
          .findOne({ _id: id, email: context.currentUser?.email })
          .populate('formUrl'); 
        if (!application) {
          throw new Error('Application not found or you are unauthorized to view this application.');
        }

        if (application.status === 'withdrawn' || application.status === 'deleted') {
          throw new Error('Application has been withdrawn or deleted.');
        }
      
        const associatedForm = await formModel.findOne({ link: application.formUrl });
        const applicationData = {
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          telephone: application.telephone,
          resume: application.resume,
          address: application.address,
          gender: application.gender,
          availability_for_interview: application.availability_for_interview,
          comments: application.comments,
          status: application.status,
          formUrl: application.formUrl,
          dateOfSubmission: application.dateOfSubmission,
          associatedForm
        };
        return {
          message: 'Application retrieved successfully',
          ...application.toObject(),
          ...applicationData,
        };
      } catch (error: any) {
        throw new Error(`Failed to retrieve application: ${error.message}`);
      }
    },
  },
  Mutation: {
    updateOwnApplication: async (_: any, { id, input }: any, context: any) => {

      if (!context.currentUser) {
        throw new AuthenticationError('You must be logged in to update your application.');
      }
    
      try {
        const application = await applicant_records.findOne({ _id: id, Email: context.currentUser?.email });
    
        if (!application) {
          throw new Error('Application not found or you are unauthorized to update this application.');
        }
    
        if (application.status === 'withdrawn' || application.status === 'deleted') {
          throw new Error('Application has been withdrawn or deleted and cannot be updated.');
        }
    
        application.set(input);
    
        const updatedApplication = await application.save();
        
        return {
          message: 'Application updated successfully',
          ...updatedApplication.toObject(),
        };
      } catch (error: any) {
        throw new Error(`Failed to update application: ${error.message}`);
      }
    }
    
  },
};

export default candidateViewOwnApplication;
