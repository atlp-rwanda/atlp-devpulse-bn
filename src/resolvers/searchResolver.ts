import { AuthenticationError } from 'apollo-server';
import { LoggedUserModel } from '../models/AuthUser';
import { RoleModel } from '../models/roleModel';
import { jobModels } from '../models/jobModels';
import { cohortModels } from '../models/cohortModel';
import { ProgramModel } from '../models/programModel';

export const searchResolver: any = {
    Query: {
        async searchData(_: any, { input }: any, ctx: any) {
            const { searchTerm, page, itemsPerPage, All, filterAttribute } = input;
            
            if (!ctx.currentUser) {
              throw new AuthenticationError('You must be logged in');
            }
          
            const userWithRole = await LoggedUserModel.findById(ctx.currentUser._id).populate('role');
            if (
              !userWithRole ||
              (userWithRole.role as any)?.roleName !== 'admin' &&
              (userWithRole.role as any)?.roleName !== "superAdmin"
            ) {
              throw new AuthenticationError('Not allowed to access.');
            }
          
            let currentPage = page || 1;
            let items = All ? await LoggedUserModel.countDocuments({}) : (itemsPerPage || 10);
            const itemsToSkip = (currentPage - 1) * items;
          
            let userQuery: any = {};
            let roleQuery: any = {};
            let jobQuery: any = {};
            let cohortQuery: any = {};
            let programQuery: any = {};
          
            const allowedUserAttributes = ['firstname', 'lastname', 'email'];
            const allowedRoleAttributes = ['roleName'];
            const allowedJobAttributes = ['title'];
            const allowedCohortAttributes = ['title', 'phase'];
            const allowedProgramAttributes = ['title'];
          
            if (searchTerm && filterAttribute) {
              if (allowedUserAttributes.includes(filterAttribute)) {
                userQuery[filterAttribute] = { $regex: `\\b${searchTerm}\\b`, $options: 'i' };
              }
            } else if (searchTerm) {
              userQuery['$or'] = [
                { firstname: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
                { lastname: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
                { email: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
              ];
            }
          
            if (searchTerm && allowedRoleAttributes.includes(filterAttribute)) {
              roleQuery[filterAttribute] = { $regex: `\\b${searchTerm}\\b`, $options: 'i' };
            } else if (searchTerm) {
              roleQuery['$or'] = [
                { roleName: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
              ];
            }
          
            const totalUsers = await LoggedUserModel.countDocuments(userQuery);
            const users = await LoggedUserModel.find(userQuery)
              .skip(itemsToSkip)
              .limit(items)
              .populate('role');
          
            const roles = await RoleModel.find(roleQuery).limit(items);

            if (searchTerm && allowedJobAttributes.includes(filterAttribute)) {
              jobQuery[filterAttribute] = { $regex: `\\b${searchTerm}\\b`, $options: 'i' };
            } else if (searchTerm) {
              jobQuery['$or'] = [
                { title: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
              ];
            }

            const jobs = await jobModels.find(jobQuery).limit(items).populate('program cohort cycle');

            if (searchTerm && allowedCohortAttributes.includes(filterAttribute)) {
              cohortQuery[filterAttribute] = { $regex: `\\b${searchTerm}\\b`, $options: 'i' };
            } else if (searchTerm) {
              cohortQuery['$or'] = [
                { title: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
                { phase: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
              ];
            }

            const cohorts = await cohortModels.find(cohortQuery).limit(items).populate('program cycle');

            if (searchTerm && allowedProgramAttributes.includes(filterAttribute)) {
              programQuery[filterAttribute] = { $regex: `\\b${searchTerm}\\b`, $options: 'i' };
            } else if (searchTerm) {
              programQuery['$or'] = [
                { title: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
              ];
            }

            const programs = await ProgramModel.find(programQuery).limit(items);

            return {
              users,
              roles,
              jobs,
              cohorts,
              programs,
              totalUsers,
              totalPages: Math.ceil(totalUsers / items),
              currentPage,
            };
          },
    }
}