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

        const getIndexArrOfTheTrainee = (correctColumnOfProperty: string[]) => {
          const arrayOfTraineeProperties = ["firstName", "lastName", "email"];
          const traineeIndexArray = [];
          for (let i = 0; i < arrayOfTraineeProperties.length; i++) {
            // @ts-ignore
            if (correctColumnOfProperty.includes(arrayOfTraineeProperties[i])) {
              // @ts-ignore
              const index = correctColumnOfProperty.indexOf(
                arrayOfTraineeProperties[i]
              );
              traineeIndexArray.push(index);
            }
          }
          return traineeIndexArray;
        };

        const giveMeDataInACorrectFormatTrainee = (
          arrOfAllRows: any,
          correctColumnArr: any,
          arrOfTraineeIndexes: any
        ) => {
          const arrOfObject = [];
          for (let i = 1; i < arrOfAllRows.length; i++) {
            arrOfObject.push({
              [correctColumnArr[arrOfTraineeIndexes[0]]]:
                arrOfAllRows[i][arrOfTraineeIndexes[0]],
              [correctColumnArr[arrOfTraineeIndexes[1]]]:
                arrOfAllRows[i][arrOfTraineeIndexes[1]],
              [correctColumnArr[arrOfTraineeIndexes[2]]]:
                arrOfAllRows[i][arrOfTraineeIndexes[2]],
            });
          }
          return arrOfObject;
        };

        const oneTwo = (dataObject: any) => {
          let finObject = { ...dataObject };
          if (dataObject.isEmployed.toLowerCase() === "no") {
            finObject = {
              ...finObject,
              isEmployed: false,
            };
          }
          if (dataObject.haveLaptop.toLowerCase() === "no") {
            finObject = {
              ...finObject,
              haveLaptop: false,
            };
          }
          if (dataObject.isStudent.toLowerCase() === "no") {
            finObject = {
              ...finObject,
              isStudent: false,
            };
          }
          if (dataObject.isStudent.toLowerCase() === "yes") {
            finObject = {
              ...finObject,
              isStudent: true,
            };
          }
          if (dataObject.haveLaptop.toLowerCase() === "yes") {
            finObject = {
              ...finObject,
              haveLaptop: true,
            };
          }
          if (dataObject.isEmployed.toLowerCase() === "yes") {
            finObject = {
              ...finObject,
              isEmployed: true,
            };
          }
          return finObject;
        };

        const giveMeDataInACorrectFormatAttributes = (
          arr: any,
          arrOfCorrectColumnProperties: any
        ) => {
          const arrOfObject = [];
          for (let i = 1; i < arr.length; i++) {
            arrOfObject.push({
              [arrOfCorrectColumnProperties[3]]: arr[i][3],
              [arrOfCorrectColumnProperties[4]]: arr[i][4],
              [arrOfCorrectColumnProperties[5]]: arr[i][5],
              [arrOfCorrectColumnProperties[6]]: arr[i][6],
              [arrOfCorrectColumnProperties[7]]: arr[i][7],
              [arrOfCorrectColumnProperties[8]]: arr[i][8],
              [arrOfCorrectColumnProperties[9]]: arr[i][9],
              [arrOfCorrectColumnProperties[10]]: arr[i][10],
              [arrOfCorrectColumnProperties[11]]: arr[i][11],
              [arrOfCorrectColumnProperties[12]]: arr[i][12],
              [arrOfCorrectColumnProperties[13]]: arr[i][13],
              [arrOfCorrectColumnProperties[14]]: arr[i][14],
              [arrOfCorrectColumnProperties[15]]: arr[i][15],
              [arrOfCorrectColumnProperties[16]]: arr[i][16],
              [arrOfCorrectColumnProperties[17]]: arr[i][17],
              [arrOfCorrectColumnProperties[18]]: arr[i][18],
              [arrOfCorrectColumnProperties[19]]: arr[i][19],
              [arrOfCorrectColumnProperties[20]]: arr[i][20],
              [arrOfCorrectColumnProperties[0]]: arr[i][0],
              [arrOfCorrectColumnProperties[1]]: arr[i][1],
              [arrOfCorrectColumnProperties[2]]: arr[i][2],
            });
          }
          const arrOfAttributesData = arrOfObject.map((item: any) => {
            delete item["firstName"];
            delete item["lastName"];
            delete item["email"];
            return oneTwo(item);
          });
          return arrOfAttributesData;
        };

        const SPValuesArr: any = rows.data.values;

        // console.log("the value of spread sheet is:", SPValuesArr[0]);

        let newErrorArr: any = [0][0];
        let retunedNewUnmached: any = [];
        //loop through rows and add them to our db
        if (rows.data.values !== undefined && rows.data.values !== null) {
          for (let i = 0; i < rows.data?.values[0]?.length; i++) {
            if (!validationArray.includes(SPValuesArr[0][i])) {
              newErrorArr = SPValuesArr[0][i];
              retunedNewUnmached.push(newErrorArr);
            }
          }
          if (retunedNewUnmached.length !== 0) {
            throw new Error(`${retunedNewUnmached}`);
          }

          // but if there is no error just save them or him into database.
          // @ts-ignore
          const correctColumn = rows?.data?.values[0];
          const indexes = getIndexArrOfTheTrainee(correctColumn);
          const traineeArray = giveMeDataInACorrectFormatTrainee(
            rows?.data?.values,
            correctColumn,
            indexes
          );
          const attributesArray = giveMeDataInACorrectFormatAttributes(
            rows?.data?.values,
            correctColumn
          );

          for (let i = 0; i < rows.data?.values?.length - 1; i++) {
            const trainee = new TraineeApplicant(traineeArray[i]);
            await trainee.save();

            const traineeAttributeObj = {
              ...attributesArray[i],
              trainee_id: trainee._id,
            };

            const traineeAttributes = new traineEAttributes(
              traineeAttributeObj
            );
            await traineeAttributes.save();
          }
        }

        return "Trainees data loaded to db successfully";
      } catch (error) {
        return error;
      }
    },

    async reSendDataIntoDb(_parent: any, _args: any) {
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

      const { columnData } = _args;
      const arrOfProperty = Object.keys(columnData);
      // ["email", "firstName",] arrOne[3]
      const arrOfValues = Object.values(columnData);
      // ["", "emails", "first Name", "", "", "", ] arrTwo[3]

      const replaceToGetCorrectColumn = (firstRowColumnArr: string[]) => {
        for (let i = 0; i < firstRowColumnArr.length; i++) {
          // @ts-ignore
          if (firstRowColumnArr.includes(arrOfValues[i])) {
            // @ts-ignore
            const index = firstRowColumnArr.indexOf(arrOfValues[i]);
            firstRowColumnArr.splice(index, 1, arrOfProperty[i]);
          }
        }
        return firstRowColumnArr;
      };

      const getIndexArrOfTheTrainee = (correctColumnOfProperty: string[]) => {
        const arrayOfTraineeProperties = ["firstName", "lastName", "email"];
        const traineeIndexArray = [];
        for (let i = 0; i < arrayOfTraineeProperties.length; i++) {
          // @ts-ignore
          if (correctColumnOfProperty.includes(arrayOfTraineeProperties[i])) {
            // @ts-ignore
            const index = correctColumnOfProperty.indexOf(
              arrayOfTraineeProperties[i]
            );
            traineeIndexArray.push(index);
          }
        }
        return traineeIndexArray;
      };

      const giveMeDataInACorrectFormatTrainee = (
        arrOfAllRows: any,
        correctColumnArr: any,
        arrOfTraineeIndexes: any
      ) => {
        // [1,8,12]
        const arrOfObject = [];
        for (let i = 1; i < arrOfAllRows.length; i++) {
          arrOfObject.push({
            [correctColumnArr[arrOfTraineeIndexes[0]]]:arrOfAllRows[i][arrOfTraineeIndexes[0]],
            [correctColumnArr[arrOfTraineeIndexes[1]]]:arrOfAllRows[i][arrOfTraineeIndexes[1]],
            [correctColumnArr[arrOfTraineeIndexes[2]]]:arrOfAllRows[i][arrOfTraineeIndexes[2]],
          });
        }
        return arrOfObject;
      };
      // arrOfProperty.data.object = []
      // [arr[0][3]]
const oneTwo = (dataObject: any) => {
  let finObject = {...dataObject}
  if (dataObject.isEmployed.toLowerCase() === "no") {
    finObject = {
      ...finObject,
      isEmployed: false,
    };
  }
   if (dataObject.haveLaptop.toLowerCase() === "no") {
     finObject = {
       ...finObject,
       haveLaptop: false,
     };
   }
    if (dataObject.isStudent.toLowerCase() === "no") {
      finObject = {
        ...finObject,
        isStudent: false,
      };
    }
     if (dataObject.isStudent.toLowerCase() === "yes") {
       finObject = {
         ...finObject,
         isStudent: true,
       };
     }
      if (dataObject.haveLaptop.toLowerCase() === "yes") {
        finObject = {
          ...finObject,
          haveLaptop: true,
        };
      }
       if (dataObject.isEmployed.toLowerCase() === "yes") {
         finObject = {
           ...finObject,
           isEmployed: true,
         };
       }
  return finObject;
};

      const giveMeDataInACorrectFormatAttributes = (
        arr: any,
        arrOfCorrectColumnProperties: any
      ) => {
        const arrOfObject = [];
        for (let i = 1; i < arr.length; i++) {
          arrOfObject.push({
            [arrOfCorrectColumnProperties[3]]: arr[i][3],
            [arrOfCorrectColumnProperties[4]]: arr[i][4],
            [arrOfCorrectColumnProperties[5]]: arr[i][5],
            [arrOfCorrectColumnProperties[6]]: arr[i][6],
            [arrOfCorrectColumnProperties[7]]: arr[i][7],
            [arrOfCorrectColumnProperties[8]]: arr[i][8],
            [arrOfCorrectColumnProperties[9]]: arr[i][9],
            [arrOfCorrectColumnProperties[10]]: arr[i][10],
            [arrOfCorrectColumnProperties[11]]: arr[i][11],
            [arrOfCorrectColumnProperties[12]]: arr[i][12],
            [arrOfCorrectColumnProperties[13]]: arr[i][13],
            [arrOfCorrectColumnProperties[14]]: arr[i][14],
            [arrOfCorrectColumnProperties[15]]: arr[i][15],
            [arrOfCorrectColumnProperties[16]]: arr[i][16],
            [arrOfCorrectColumnProperties[17]]: arr[i][17],
            [arrOfCorrectColumnProperties[18]]: arr[i][18],
            [arrOfCorrectColumnProperties[19]]: arr[i][19],
            [arrOfCorrectColumnProperties[20]]: arr[i][20],
            [arrOfCorrectColumnProperties[0]]: arr[i][0],
            [arrOfCorrectColumnProperties[1]]: arr[i][1],
            [arrOfCorrectColumnProperties[2]]: arr[i][2],
          });
        }

        const arrOfAttributesData = arrOfObject.map((item:any) => {
               delete item["firstName"];
               delete item["lastName"];
               delete item["email"];
          return oneTwo(item);
        });
        return arrOfAttributesData;
      };

      // @ts-ignore
      const correctColumn = replaceToGetCorrectColumn(rows?.data?.values[0]);
      const indexes = getIndexArrOfTheTrainee(correctColumn);
      const traineeArray = giveMeDataInACorrectFormatTrainee(
        rows?.data?.values,
        correctColumn,
        indexes
      );
      const attributesArray = giveMeDataInACorrectFormatAttributes(
        rows?.data?.values,
        correctColumn
      );

      // save the trainee to the database
      // @ts-ignore
      for (let i = 0; i < rows.data?.values?.length - 1; i++) {
        const trainee = new TraineeApplicant(traineeArray[i]);
        await trainee.save();

        const traineeAttributeObj = {
          ...attributesArray[i],
          trainee_id: trainee._id,
        };
        const traineeAttributes = new traineEAttributes(traineeAttributeObj);
        await traineeAttributes.save();
      }
      return "The data mapped has been saved successfully, CONGRATS";
    },
  },
};

export default loadTraineeResolver;
