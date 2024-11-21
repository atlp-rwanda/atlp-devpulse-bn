import { connect } from '../database/db.config'
import seedBlogs from "./blogs";

import seedDeleteTrainee from './DelTrainee';
import seedJobs from './jobs';
import seedPrograms from './programs';
import seedCohorts from './cohorts';
import seedUsers from './users';
import seedApplications from './applications';
import seedApplicationCycle from './applicationCyle';

connect().then(async () => {
    await seedApplicationCycle();
    await seedUsers();
    await seedDeleteTrainee()
    await seedPrograms();
    await seedCohorts();
    await seedJobs();
    await seedApplications();
    await seedBlogs();
    process.exit()
})
