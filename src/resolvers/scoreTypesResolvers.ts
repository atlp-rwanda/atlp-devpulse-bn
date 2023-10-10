import scoreTypesModel from "../models/scoreTypesModel";
import scoreValuesModel from "../models/scoreValueModel";
import { LoggedUserModel } from "../models/AuthUser";

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
        if (Object.keys(filter).length === 0) {
          const allScoreTypes = await scoreTypesModel.find({});
          return allScoreTypes;
        }
        const getScoreTypes = await scoreTypesModel.find(filter);
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
      const getOneScoreType = await scoreTypesModel.findById(args.id);
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
      const newscoreType = await scoreTypesModel.create({
        title: _args.input.title,
        description: _args.input.description,
        modeOfEngagement: _args.input.modeOfEngagement,
        duration: _args.input.duration,
        startDate: _args.input.startDate,
        endDate:_args.input.endDate,
        program:_args.input.program
      });
      return newscoreType;
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
