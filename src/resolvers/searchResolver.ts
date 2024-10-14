import { AuthenticationError } from 'apollo-server';
import { LoggedUserModel } from '../models/AuthUser';
import { RoleModel } from '../models/roleModel';
import { jobModels } from '../models/jobModels';
import { cohortModels } from '../models/cohortModel';
import { ProgramModel } from '../models/programModel';
import TraineeApplicant from '../models/traineeApplicant';
import  applicationCycle  from '../models/applicationCycle';

interface SearchInput {
  searchTerm: string;
  page?: number;
  itemsPerPage?: number;
  filterAttribute?: string;
}

interface Context {
  currentUser: { _id: string };
}

export const searchResolver: any = {
  Query: {
    async searchData(_: any, { input }: { input: SearchInput }, ctx: Context) {
      const { searchTerm, page, itemsPerPage, filterAttribute } = input;

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

      // Check if searchTerm is empty or undefined
      if (!searchTerm) {
        return {
          users: [],
          roles: [],
          jobs: [],
          cohorts: [],
          programs: [],
          trainees: [],
          applicationCycles: [],
          totalUsers: 0,
          totalRoles: 0,
          totalJobs: 0,
          totalCohorts: 0,
          totalPrograms: 0,
          totalTrainees: 0,
          totalApplicationCycles: 0,
          totalPages: {
            users: 0,
            roles: 0,
            jobs: 0,
            cohorts: 0,
            programs: 0,
            trainees: 0,
            applicationCycles: 0,
          },
          currentPage: page || 1,
        };
      }

      let currentPage = page || 1;
      let items = itemsPerPage || 10;
      const itemsToSkip = (currentPage - 1) * items;

      let userQuery: any = {};
      let roleQuery: any = {};
      let jobQuery: any = {};
      let cohortQuery: any = {};
      let programQuery: any = {};
      let traineesQuery: any = {};
      let applicationCycleQuery: any = {};

      const allowedUserAttributes = ['firstname', 'lastname', 'email'];
      const allowedRoleAttributes = ['roleName'];
      const allowedJobAttributes = ['title'];
      const allowedCohortAttributes = ['title'];
      const allowedProgramAttributes = ['title'];
      const allowedTraineeAttributes = ['firstName', 'lastName', 'email'];
      const allowedApplicationCycleAttributes = ['name'];

      if (searchTerm) {
        // User query
        if (filterAttribute && allowedUserAttributes.includes(filterAttribute)) {
          userQuery = { [filterAttribute]: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } };
        } else if (!filterAttribute) {
          userQuery['$or'] = [
            { firstname: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
            { lastname: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
            { email: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
          ];
        } else {
          userQuery = { _id: null };
        }
      
        // Role query
        if (filterAttribute && allowedRoleAttributes.includes(filterAttribute)) {
          roleQuery = { [filterAttribute]: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } };
        } else if (!filterAttribute) {
          roleQuery['$or'] = [
            { roleName: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
          ];
        } else {
          roleQuery = { _id: null };
        }
      
        // Job query
        if (filterAttribute && allowedJobAttributes.includes(filterAttribute)) {
          jobQuery = { [filterAttribute]: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } };
        } else if (!filterAttribute) {
          jobQuery['$or'] = [
            { title: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
            { description: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
          ];
        } else {
          jobQuery = { _id: null };
        }
      
        // Cohort query
        if (filterAttribute && allowedCohortAttributes.includes(filterAttribute)) {
          cohortQuery = { [filterAttribute]: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } };
        } else if (!filterAttribute) {
          cohortQuery['$or'] = [
            { title: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
          ];
        } else {
          cohortQuery = { _id: null };
        }
      
        // Program query
        if (filterAttribute && allowedProgramAttributes.includes(filterAttribute)) {
          programQuery = { [filterAttribute]: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } };
        } else if (!filterAttribute) {
          programQuery['$or'] = [
            { title: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
            { description: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
            { mainObjective: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
          ];
        } else {
          programQuery = { _id: null };
        }
      
        // Trainee query
        if (filterAttribute && allowedTraineeAttributes.includes(filterAttribute)) {
          traineesQuery = { [filterAttribute]: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } };
        } else if (!filterAttribute) {
          traineesQuery['$or'] = [
            { firstName: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
            { lastName: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
            { email: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
          ];
        } else {
          traineesQuery = { _id: null };
        }
      
        // Application Cycle query
        if (filterAttribute && allowedApplicationCycleAttributes.includes(filterAttribute)) {
          applicationCycleQuery = { [filterAttribute]: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } };
        } else if (!filterAttribute) {
          applicationCycleQuery['$or'] = [
            { name: { $regex: `\\b${searchTerm}\\b`, $options: 'i' } },
          ];
        } else {
          applicationCycleQuery = { _id: null };
        }
      }
      
      const totalUsers = await LoggedUserModel.countDocuments(userQuery);
      const users = await LoggedUserModel.find(userQuery)
        .skip(itemsToSkip)
        .limit(items)
        .populate('role');

      const totalRoles = await RoleModel.countDocuments(roleQuery);
      const roles = await RoleModel.find(roleQuery)
        .skip(itemsToSkip)
        .limit(items);

      const totalJobs = await jobModels.countDocuments(jobQuery);
      const jobs = await jobModels.find(jobQuery)
        .skip(itemsToSkip)
        .limit(items)
        .populate('program cohort cycle');

      const totalCohorts = await cohortModels.countDocuments(cohortQuery);
      const cohorts = await cohortModels.find(cohortQuery)
        .skip(itemsToSkip)
        .limit(items)
        .populate('program cycle');

      const totalPrograms = await ProgramModel.countDocuments(programQuery);
      const programs = await ProgramModel.find(programQuery)
        .skip(itemsToSkip)
        .limit(items);

      const totalTrainees = await TraineeApplicant.countDocuments(traineesQuery);
      const trainees = await TraineeApplicant.find(traineesQuery)
        .skip(itemsToSkip)
        .limit(items)
        .populate('cycle_id');

      const totalApplicationCycles = await applicationCycle.countDocuments(applicationCycleQuery);
      const applicationCycles = await applicationCycle.find(applicationCycleQuery)
        .skip(itemsToSkip)
        .limit(items);

      return {
        users,
        roles,
        jobs,
        cohorts,
        programs,
        trainees,
        applicationCycles,
        totalUsers,
        totalRoles,
        totalJobs,
        totalCohorts,
        totalPrograms,
        totalTrainees,
        totalApplicationCycles,
        totalPages: {
          users: Math.ceil(totalUsers / items),
          roles: Math.ceil(totalRoles / items),
          jobs: Math.ceil(totalJobs / items),
          cohorts: Math.ceil(totalCohorts / items),
          programs: Math.ceil(totalPrograms / items),
          trainees: Math.ceil(totalTrainees / items),
          applicationCycles: Math.ceil(totalApplicationCycles / items),
        },
        currentPage,
      };
    },
  }
}