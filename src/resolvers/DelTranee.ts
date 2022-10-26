import TraineeApplicant from "../models/traineeApplicant";

const traineeResolvers: any = {
  Mutation: {
    async softdeleteTrainee(parent: any, args: any) {
      const trainee = await TraineeApplicant.findById(args.input.id);
      if (!trainee) throw new Error("Trainee doesn't exist");
      const softDelete = await TraineeApplicant.findByIdAndUpdate(
        args.input.id,
        { $set: { delete_at: true, id: args.input.id } },
        { new: true }
      );
      return softDelete;
    },
    async softRecover(parent: any, args: any) {
      const trainee = await TraineeApplicant.findById(args.input.id);
      if (!trainee) throw new Error("Trainee doesn't exist");
      const softRecovered = await TraineeApplicant.findByIdAndUpdate(
        args.input.id,
        { $set: { delete_at: false, id: args.input.id } },
        { new: true }
      );
      return softRecovered;
    },
  },
};
export default traineeResolvers;
