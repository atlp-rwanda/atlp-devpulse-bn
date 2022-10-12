import TraineeApplicant from "../models/traineeApplicant";
import { traineEAttributes } from "../models/traineeAttribute";
import { google } from "googleapis";

const loadTraineeResolver: any = {
  Query: {
    async getAllTraineeApplicant() {
      const trainees = await TraineeApplicant.find({});
      return trainees;
    },
    async getAllTraineeAtributes() {
      const traineesAttribute = await traineEAttributes.find({});
      return traineesAttribute;
    },
  },
  Mutation: {
    async loadAllTrainees(_parent: any, _args: any) {
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
        const validationArray = [
          "firstName",
          "lastName",
          "email",
          "gender",
          "birth_date",
          "phone",
          "field_of_study",
          "education_level",
          "province",
          "district",
          "cohort",
          "isEmployed",
          "isStudent",
          "Hackerrank_score",
          "english_score",
          "interview",
          "interview_decision",
          "past_andela_programs",
          "Address",
          "sector",
          "haveLaptop",
          "trainee_id",
        ];
        //loop through rows and add them to our db
        if (rows.data.values !== undefined && rows.data.values !== null) {
          for (let i = 1; i < rows.data?.values[0]?.length; i++) {
           

            if (!validationArray.includes(rows.data.values[0][i])) {
              throw new Error(
               `The column ",${rows.data.values[0][i]}," is not the same as  ",${validationArray[i]}," which is defined in the database" Please verify And Match Them:
              =================================================
              In order to avoid this error again kindly follow the following procedure!

              ===========================================================================

              , column [1] heading should named as :firstName,
              column [2] heading should named as :lastName,
              column [3] heading should named as :email,
              column [4] heading should named as :gender,
              column [5] heading should named as :birth_date,
              column [6] heading should named as :phone,
              column [7] heading should named as :field_of_study,
              column [8] heading should named as :education_level,
              column [9] heading should named as :cohort,
              column [10] heading should named as :district,
              column [11] heading should named as :isEmployed,
              column [12] heading should named as :isStudent,
              column [13] heading should named as :Hackerrank_score,
              column [14] heading should named as :english_score,
              column [15] heading should named as :interview,
              column [16] heading should named as :interview_decision,
              column [17] heading should named as :past_andela_programs,
              column [18] heading should named as :Address,
              column [19] heading should named as :sector,
              column [20] heading should named as :haveLaptop,
              column [21] heading should named as :trainee_id,
              `);
            }}
          
          for (let i = 1; i < rows.data?.values?.length; i++) {
            const trainee = new TraineeApplicant({
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
