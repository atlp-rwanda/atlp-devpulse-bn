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

        const giveMeDataInACorrectFormat = (arr: any) => {
          const arrOfObject = [];
          for (let i = 1; i < arr.length; i++) {
            arrOfObject.push({
              [arr[0][3]]: arr[i][3],
              [arr[0][4]]: arr[i][4],
              [arr[0][5]]: arr[i][5],
              [arr[0][6]]: arr[i][6],
              [arr[0][7]]: arr[i][7],
              [arr[0][8]]: arr[i][8],
              [arr[0][9]]: arr[i][9],
              [arr[0][10]]: arr[i][10],
              [arr[0][11]]: arr[i][11],
              [arr[0][12]]: arr[i][12],
              [arr[0][13]]: arr[i][13],
              [arr[0][14]]: arr[i][14],
              [arr[0][15]]: arr[i][15],
              [arr[0][16]]: arr[i][16],
              [arr[0][17]]: arr[i][17],
              [arr[0][18]]: arr[i][18],
              [arr[0][19]]: arr[i][19],
              [arr[0][20]]: arr[i][20],
              [arr[0][0]]: arr[i][0],
              [arr[0][1]]: arr[i][1],
              [arr[0][2]]: arr[i][2],
            });
          }
          return arrOfObject;
        };

        const SPValuesArr: any = rows.data.values;
        // console.log("the value of spread sheet is:", SPValuesArr[0]);
        // console.log(giveMeDataInACorrectFormat(SPValuesArr));
        let newErrorArr: any = [0][0];
        let retunedNewUnmached: any = [];
        //loop through rows and add them to our db
        if (rows.data.values !== undefined && rows.data.values !== null) {
          for (let count = 1; count <= 2; count++) {
            for (let i = 0; i < rows.data?.values[0]?.length; i++) {
              if (!validationArray.includes(SPValuesArr[0][i])) {
                newErrorArr = SPValuesArr[0][i];
                retunedNewUnmached.push(newErrorArr);
                // console.log("The unMached records are : ", retunedNewUnmached);
                // console.log(
                //   "The unMached records are : ",
                //   retunedNewUnmached[1]
                // );
              }
            }
            throw new Error(`${retunedNewUnmached}`);
          }

          for (let i = 1; i < rows.data?.values?.length; i++) {
            const trainee = new TraineeApplicant({
              firstName: rows.data.values[i][0],
              lastName: rows.data.values[i][1],
              email: rows.data.values[i][2],
            });

            await trainee.save();
            const traineeAttributes = new traineEAttributes({
              gender: rows.data.values[i][3],
              birth_date: rows.data.values[i][4],
              phone: rows.data.values[i][5],
              field_of_study: rows.data.values[i][6],
              education_level: rows.data.values[i][7],
              province: rows.data.values[i][8],
              district: rows.data.values[i][9],
              cohort: rows.data.values[i][10],
              isEmployed:
                rows.data.values[i][11].toLowerCase() == "yes" ? true : false,
              isStudent:
                rows.data.values[i][12].toLowerCase() == "yes" ? true : false,
              Hackerrank_score: rows.data.values[i][13],
              english_score: rows.data.values[i][14],
              interview: rows.data.values[i][15],
              interview_decision: rows.data.values[i][16],
              past_andela_programs: rows.data.values[i][17],
              Address: rows.data.values[i][18],
              sector: rows.data.values[i][19],
              haveLaptop:
                rows.data.values[i][20].toLowerCase() == "yes" ? true : false,
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

    async reSendDataIntoDb(_parent:any, _args:any) {
      const { columnData } = _args;
      // console.log(columnData);
      const arrOfProperty = Object.keys(columnData);
      const arrOfValues = Object.values(columnData);
      // console.log(arrOfProperty)
      // console.log(arrOfValues)

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
      const spreadsheetId = _args.columnData.spreadsheetId;
      const rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
      });
      // const SPVal: any = rows.data.values[0];
      const replaceTheCorrectColumn = (SPValuesArr: string[]) => {
        let arrayTracker = [];
        for (let j = 0; j < SPValuesArr.length; j++) {
          for (let i = 0; i < arrOfValues.length -1; i++) {
            if (arrOfValues[i] === SPValuesArr[i]) {
              arrayTracker.push(arrOfProperty[i]);
            }
            arrayTracker.push(SPValuesArr[i]);
          }
        };
        return arrayTracker;
      };

      // @ts-ignore
      console.log(replaceTheCorrectColumn(rows?.data?.values[0]));
      return "the data is coming men and woman";
    },
  },
};

export default loadTraineeResolver;
