import { connect } from '../database/db.config'

import seedDeleteTrainee from './DelTrainee';
import seedJobs from './jobs';
import seedPrograms from './programs';
import seedCohorts from './cohorts';
import seedUsers from './users';
import seedApplications from './applications';
import seedApplicationCycle from './applicationCyle';

connect().then(async () => {
    await seedUsers();
    await seedDeleteTrainee()
    await seedPrograms();
    await seedApplicationCycle();
    await seedCohorts();
    await seedJobs();
    await seedApplications();
    process.exit()
})
