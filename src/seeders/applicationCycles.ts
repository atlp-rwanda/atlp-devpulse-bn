import { applicationCycle } from "../models/applicationCycle";

const seedApplicationCycles = async () => {
    const ApplicationCycles = [{
        name: "Cycle one for seeds",
        startDate: "2022-01-01",
        endDate: "2022-06-30"
    },
    {
        name: "Cycle two for seeds",
        startDate: "2022-07-01",
        endDate: "2022-12-31"
    }];
    await applicationCycle.deleteMany({ ApplicationCycles });
    await applicationCycle.insertMany(ApplicationCycles);
    return null;
}

export default seedApplicationCycles;