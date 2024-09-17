import scoreTypesModel from "../models/scoreTypesModel.js";
import scoreValuesModel from "../models/scoreValueModel.js";
import { LoggedUserModel } from "../models/AuthUser.js";
import { gradingModel } from "../models/grading.js";

const scoreTypeResolver: any = {
  Query: {
    async getAllScoreTypes(_parent:any,_args:any,ctx:any) {
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser?._id
      ).populate("role");
      
      if (!userWithRole || !['admin', 'superAdmin'].includes((userWithRole.role as any)?.roleName)) {
        throw new Error("Permission denied. You must be an admin or super admin to access this data.");
      }
      try{
        const filter: any = {};

        if (_args.title) {
          filter.title = { $regex: new RegExp(_args.title, "i") };
        }
  
        if (_args.programId) {
          filter.program = _args.programId;
        }
        if (_args.description) {
          filter.description = { $regex: new RegExp(_args.description, "i") };
        }
    
        if (_args.modeOfEngagement) {
          filter.modeOfEngagement = { $regex: new RegExp(_args.modeOfEngagement, "i") };
        }
        if (Object.keys(filter).length === 0) {
          const allScoreTypes = await scoreTypesModel.find({}).populate('program grading');
          return allScoreTypes;
        }
        const getScoreTypes = await scoreTypesModel.find(filter).populate('program grading');
        return getScoreTypes;
      }
      catch{
        throw new Error("Server error");
      }
    },
    async getOneScoreType(parent: any, args: any,ctx:any) {
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser?._id
      ).populate("role");
      if (!userWithRole || !['admin', 'superAdmin'].includes((userWithRole.role as any)?.roleName)) {
        throw new Error("Permission denied. You must be an admin or super admin to access this data.");
      }
      const getOneScoreType = await scoreTypesModel.findById(args.id).populate('program grading');
      if (!scoreTypesModel) throw new Error("This cohort cycle doesn't exist");
      return getOneScoreType;
    },
  },
  Mutation: {
    async createScoreType(_parent: any, _args: any,ctx:any) {
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser?._id
      ).populate("role");
      
      if (!userWithRole || !['admin', 'superAdmin'].includes((userWithRole.role as any)?.roleName)) {
        throw new Error("Permission denied. You must be an admin or super admin to access this data.");
      }
        try{
      const scoreTypeExists = await scoreTypesModel.findOne({
        title: _args.input.title,
      });

      if (scoreTypeExists) throw new Error("assessement already exists");
      const { title, description, modeOfEngagement, duration, startDate, program,durationUnit,grading} = _args.input;

      if(startDate){
        const start=new Date(startDate)
        if(!isNaN(start.getTime())){
          start.setHours(start.getHours() + duration)
          const formattedEndDate = start.toLocaleString();
          const selectedGrading = await gradingModel.findById(grading);

          if (!selectedGrading) {
            throw new Error("Selected grading not found");
          }
      const newScoreType = await scoreTypesModel.create({
        title,
        description,
        modeOfEngagement,
        duration,
        startDate,
        durationUnit,
        endDate:formattedEndDate,
        program,
        grading:selectedGrading,
      });
      selectedGrading.assessment.push(newScoreType._id);
      await selectedGrading.save();
      return newScoreType;
    }
    }
    }
    catch(error:any){
      if (error.message.includes("Token expired")) {
        return {
          error: "Super admin token is expired. Please log in again.",
        };
      }
      throw new Error("Server error");
    }
    },
    async deleteScoreType(_parent: any, _args: any) {
      const scoreTypeToDelete = await scoreTypesModel.findById(_args.id);
      const scoreValueToDelete = await scoreValuesModel.findOne({
        id: "636cfc44786bb77edc253351",
      });

      if (scoreTypeToDelete != null) {
        const scoreTypeDeleted = await scoreTypesModel.findByIdAndRemove(
          _args.id
        );
        return scoreTypeDeleted;
      } else {
        throw new Error("This scoreTypesModel doesn't exist");
      }
    },
    async updateScoreType(_parent: any, _args: any) {
      const newscoreType = await scoreTypesModel.findByIdAndUpdate(
        _args.id,
        {
          title: _args.input.title,
          description: _args.input.description,
          modeOfEngagement: _args.input.modeOfEngagement,
          duration: _args.input.duration,
          startDate: _args.input.startDate,
          endDate:_args.input.endDate,
          program:_args.input.program
        },
        { new: true }
      );
      return newscoreType;
    },
  },
};

export default scoreTypeResolver;
