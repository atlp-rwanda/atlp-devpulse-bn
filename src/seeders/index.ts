import { connect } from '../database/db.config'

import Applicationseed from './applicationcycle'
import seedDeleteTrainee from './DelTrainee'

connect().then(async () => {
    await Applicationseed()
    await      seedDeleteTrainee()
    process.exit()
})
