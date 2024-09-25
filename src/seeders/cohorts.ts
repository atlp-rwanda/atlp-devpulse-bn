import { cohortModels } from "../models/cohortModel";
import { ProgramModel } from "../models/programModel";
import { applicationCycle } from "../models/applicationCycle";

const seedCohorts = async () => {
    const program = await ProgramModel.findOne();
    const cycle = await applicationCycle.findOne();

    if(!program || !cycle){
        return;
    }
    const cohorts = [
        {
            title: "Cohort 1",
            program: program._id,
            cycle: cycle._id,
            phase: "Phase 1",
            start: "2022-01-01",
            end: "2022-12-31"
        },
        {
            title: "Cohort 2",
            program: program._id,
            cycle: cycle._id,
            phase: "Phase 2",
            start: "2023-01-01",
            end: "2023-12-31"
        },
    ];

    await cohortModels.deleteMany({cohorts});
    await cohortModels.insertMany(cohorts);
}

export default seedCohorts