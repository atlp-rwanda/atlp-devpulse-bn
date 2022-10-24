import { connect } from '../database/db.config'

import Applicationseed from './applicationcycle'

connect().then(async () => {
    console.log("mongo is running again for seeders")
    const data = await Applicationseed()
    console.log(data)
    process.exit()
})
