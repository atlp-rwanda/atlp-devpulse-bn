import scoreValuesModel from "../models/scoreValueModel.js";
import { traineEAttributes } from "../models/traineeAttribute.js";
import scoreTypesModel from "../models/scoreTypesModel.js";

const scoreTypeResolver: any = {
  Query: {
    async getAllScoreValues(parent: any, args: any) {
      const getScoreValues = await scoreValuesModel
        .find({})
        .populate({
          path: "attr_id",
          populate: {
            path: "trainee_id",
            populate: {
              path: "cycle_id",
            },
          },
        })
        .populate({
          path: "score_id",
        })
        .exec();
      const vauedDt = getScoreValues.filter((item: any) => {
        return item.score_id !== null;
      });

      return vauedDt;
    },
    async getOneScoreValue(parent: any, args: any) {
      const getOneScoreValue = await scoreValuesModel
        .findById(args.id)
        .populate({
          path: "attr_id",
          populate: {
            path: "trainee_id",
            populate: {
              path: "cycle_id",
            },
          },
        })
        .populate({
          path: "score_id",
        })
        .exec();
      if (!scoreValuesModel) throw new Error("This cohort cycle doesn't exist");
      return getOneScoreValue;
    },
  },
  Mutation: {
    async createScoreValue(_parent: any, _args: any) {
      const inputValues = _args.input;

      const attrId = inputValues.map((item: any) => {
        return item.attr_id;
      });
      const scoreId = inputValues.map((item: any) => {
        return item.score_id;
      });

      const valueArr = inputValues.map(function (item: any) {
        return item.score_id;
      });
      const isDuplicate = valueArr.some(function (item: any, idx: any) {
        return valueArr.indexOf(item) != idx;
      });
      const scoreValueExists = await scoreValuesModel.findOne({
        attr_id: attrId,
        score_id: scoreId,
      });

      if (scoreValueExists)
        throw new Error(
          `This trainee has already been rated. You can however update the ratings.`
        );
      const newscoreValue = await scoreValuesModel.create(inputValues);
      return newscoreValue;
    },
    async deleteScoreValue(_parent: any, _args: any) {
      const scoreValueToDelete = await scoreValuesModel.findById(_args.id);
      if (scoreValueToDelete != null) {
        const scoreValueDeleted = await scoreValuesModel.findByIdAndRemove(
          _args.id
        );
        return scoreValueDeleted;
      } else {
        throw new Error("This scoreValuesModel doesn't exist");
      }
    },
    async updateScoreValue(_parent: any, _args: any) {
      // const inputValues = _args.input;
      // var newObjId;
      // var lastObjId;
      // var returnedValue: any = {};
      // var arr: any = [];
      // var arr: any = [];

      // for (let i = 0; i < inputValues.length; i++) {
      //   newObjId = inputValues[i].id;
      //   lastObjId = inputValues[i];
      //   const newscoreValue = await scoreValuesModel.findByIdAndUpdate(
      //     newObjId,
      //     lastObjId,
      //     { new: true }
      //   );
      //   arr.push(newscoreValue);
      // }

      // return arr;
      const newscoreType = await scoreValuesModel.findByIdAndUpdate(
        _args.id,
        {
          score_value: _args.input.score_value,
        },
        { new: true }
      );
      return newscoreType;
    },
    async updateManyScoreValues(_parent: any, _args: any) {
      const inputValues = _args.input;
      var newObjId;
      var lastObjId;
      var returnedValue: any = {};
      var arr: any = [];
      var arr: any = [];

      for (let i = 0; i < inputValues.length; i++) {
        newObjId = inputValues[i].id;
        lastObjId = inputValues[i];
        const newscoreValue = await scoreValuesModel.findByIdAndUpdate(
          newObjId,
          lastObjId,
          { new: true }
        );
        arr.push(newscoreValue);
      }

      return arr;
    },
  },
};

export default scoreTypeResolver;
