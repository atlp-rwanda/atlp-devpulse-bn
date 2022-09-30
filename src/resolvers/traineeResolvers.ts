import Trainee from "../models/trainee";
import { traineEAttributes } from "../models/traineeAttribute";
import { google } from "googleapis";

const loadTraineeResolver: any = {
  Query: {
    async getTrainees() {
      const trainees = await Trainee.find({});
      return trainees;
    },
    async getTraineesAttribute() {
      const traineesAttribute = await traineEAttributes.find({});
      return traineesAttribute;
    },
  },

  Mutation: {
    async loadTrainees(_parent: any, _args: any) {
      try {
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

        //read rows from spreadsheet
        const spreadsheetId = _args.spreadsheetId;
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
              email: rows.data.values[i][4],
            });

            await trainee.save();

            const traineeAttributes = new traineEAttributes({
              gender: rows.data.values[i][3],
              birth_date: rows.data.values[i][5],
              phone: rows.data.values[i][6],
              field_of_study: rows.data.values[i][7],
              education_level: rows.data.values[i][8],
              province: rows.data.values[i][9],
              district: rows.data.values[i][10],
              cohort: rows.data.values[i][11],
              isEmployed:
                rows.data.values[i][12].toLowerCase() == "yes" ? true : false,
              isStudent:
                rows.data.values[i][13].toLowerCase() == "yes" ? true : false,
              Hackerrank_score: rows.data.values[i][14],
              english_score: rows.data.values[i][15],
              interview: rows.data.values[i][16],
              interview_decision: rows.data.values[i][17],
              past_andela_programs: rows.data.values[i][18],
              Address: rows.data.values[i][19],
              sector: rows.data.values[i][20],
              haveLaptop:
                rows.data.values[i][21].toLowerCase() == "yes" ? true : false,
              trainee_id: trainee._id,
            });

            await traineeAttributes.save();
          }
        }

        return "Trainees data loaded to db successfully";
      } catch (error) {
        return error;
      }
    },
  },
};

export default loadTraineeResolver;
