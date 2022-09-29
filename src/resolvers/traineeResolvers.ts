import Trainee from "../models/trainee";
import { google } from "googleapis";

const loadTraineeResolver: any = {
  Query: {
    async getTrainees() {
      const trainees = await Trainee.find({});
      return trainees;
    },
  },
  Mutation: {
    async loadTrainees(_parent: any, _args: any) {
      const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });

      //create client instance for auth
      const client = await auth.getClient();

      //instance of google sheets API
      const googleSheets = google.sheets({
        version: "v4",
        auth: client,
      });

      //get metadata of the spreadsheet
      const spreadsheetId = _args.spreadsheetId;
      const metadData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
      });

      //read rows from spreadsheet
      const rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
      });
      //loop through rows and add them to our db
      if (rows.data.values !== undefined && rows.data.values !== null) {
        for (let i = 1; i < rows.data?.values?.length; i++) {
          const trainee = new Trainee({
            firstName: rows.data.values[i][1],
            lastName: rows.data.values[i][2],
            gender: rows.data.values[i][3],
            email: rows.data.values[i][4],
            age: rows.data.values[i][5],
            phoneNumber: rows.data.values[i][6],
            fieldOfStudy: rows.data.values[i][7],
            highOrCurrentEducation: rows.data.values[i][8],
            province: rows.data.values[i][9],
            district: rows.data.values[i][10],
            cohort: rows.data.values[i][11],
            employmentStatus: rows.data.values[i][12],
            isStudent: rows.data.values[i][13],
            hackerrankScore: rows.data.values[i][14],
            englishScore: rows.data.values[i][15],
            interview: rows.data.values[i][16],
            decision: rows.data.values[i][17],
            pastAndela: rows.data.values[i][18],
          });
          await trainee.save();
        }
      }

      return "Trainees loaded to db successfully";
    },
  },
};

export default loadTraineeResolver;
