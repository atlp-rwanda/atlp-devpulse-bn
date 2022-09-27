import { connect } from '../database/db.config'

import Applicationseed from './applicationcycle'

connect().then(async () => {
    await Applicationseed()
    process.exit()
})
