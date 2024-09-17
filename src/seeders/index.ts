import { connect } from '../database/db.config.js'

import Applicationseed from './applicationcycle.js'
import seedDeleteTrainee from './DelTrainee.js'

connect().then(async () => {
    await Applicationseed()
    await      seedDeleteTrainee()
    process.exit()
})
