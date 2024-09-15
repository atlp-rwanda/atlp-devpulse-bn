import { connect } from '../database/db.config'

import Applicationseed from './applicationcycle'
import seedDeleteTrainee from './DelTrainee';
import seedJobs from './jobs';
import seedPrograms from './programs';
import seedCohorts from './cohorts';

connect().then(async () => {
    await Applicationseed()
    await      seedDeleteTrainee()
    await seedPrograms();
    await seedCohorts();
    await seedJobs();
    process.exit()
})
