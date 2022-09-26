import 'dotenv/config'
import mongoose from 'mongoose'

// uri of the database
const uri =
  process.env.NODE_ENV === 'development'
      ? process.env.MONGO_DEV_DB
      : process.env.NODE_ENV === 'test'
          ? process.env.MONGO_TEST_DB
          : process.env.MONGO_PROD_DB


export const connect = async (): Promise<void> => {
    try {
    //MONGODB CONNECTION
        await mongoose.connect(uri!)
    } catch (error) {
        console.log(`Database connection error: ${error}`)
        process.exit(1)
    }
}
