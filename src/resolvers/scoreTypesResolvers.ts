import scoreTypesModel from "../models/scoreTypesModel";
import scoreValuesModel from "../models/scoreValueModel";

const scoreTypeResolver: any = {
  Query: {
    async getAllScoreTypes() {
      const getScoreTypes = await scoreTypesModel.find({});
      return getScoreTypes;
    },
    async getOneScoreType(parent: any, args: any) {
      const getOneScoreType = await scoreTypesModel.findById(args.id);
      if (!scoreTypesModel) throw new Error("This cohort cycle doesn't exist");
      return getOneScoreType;
    },
  },
  Mutation: {
    async createScoreType(_parent: any, _args: any) {
      const scoreTypeExists = await scoreTypesModel.findOne({
        score_type: _args.input.score_type,
      });

      if (scoreTypeExists) throw new Error("scoreTypesModel already exists");
      const newscoreType = await scoreTypesModel.create({
        score_type: _args.input.score_type,
      });
      return newscoreType;
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
          score_type: _args.input.score_type,
        },
        { new: true }
      );
      return newscoreType;
    },
  },
};

export default scoreTypeResolver;
