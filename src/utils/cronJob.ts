import cron from 'node-cron';
import {formModel} from '../models/formsModel'
import {processSheetData} from '../resolvers/appliedJobResolver'
cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Running cron job to fetch sheet data...');
  
      const sheetLinks = await formModel.find({spreadsheetlink: {$exists: true}});
  
      if (sheetLinks.length === 0) {
        console.log('No sheet links found in the database.');
        return;
      }
  
      // Loop through each sheet link and process its data
      for (const sheet of sheetLinks) {
        const { spreadsheetlink } = sheet;
        try {
          console.log(`Processing data for sheet: ${spreadsheetlink}`);
          await processSheetData(spreadsheetlink);
          console.log(`Data processed successfully for sheet: ${spreadsheetlink}`);
        } catch (error:any) {
          console.error(`Error processing data for sheet ${spreadsheetlink}:`, error.message);
        }
      }
  
    } catch (error:any) {
      console.error('Error running cron job:', error.message);
    }
  });
  
  console.log('Cron job set up to run every 5 minutes.');