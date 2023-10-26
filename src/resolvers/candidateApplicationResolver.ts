import { applicant_records } from "../models/candidateApplication";

const candidateApplicationResolver = {
  Mutation: {
    async deleteCandidateApplication(_: any, { id }: any, context: any) {
      try {
        console.log(context.currentUser);
        if (!context.currentUser) {
          return { message: "Anauthorized." };
        }
        const userEmail = context.currentUser?.email;

        const applicationCycleExists = await applicant_records.findOne({
          _id: id,
          Email: userEmail,
        });
        if (!applicationCycleExists) {
          return { message: "Application not found or you are unauthorized." };
        }

        if (applicationCycleExists.status === "old") {
          await applicant_records.updateOne(
            { _id: id },
            { $set: { status: "deleted" } }
          );
          return { message: "Application has been deleted!", id };
        }

        if (
          applicationCycleExists.status === "submitted" ||
          applicationCycleExists.status === "received"
        ) {
          await applicant_records.updateOne(
            { _id: id },
            { $set: { status: "withdrawn" } }
          );
          return { message: "Application has been withdrawn!", id };
        }

        return { message: "Application not found" };
      } catch (error: any) {
        throw new Error(`Error withdrawing application: ${error.message}`);
      }
    },
  },
};

export default candidateApplicationResolver;
