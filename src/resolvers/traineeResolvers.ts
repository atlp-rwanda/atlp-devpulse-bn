import TraineeApplicant from "../models/traineeApplicant";
import { traineEAttributes } from "../models/traineeAttribute";
import { google } from "googleapis";
import { applicationCycle } from "../models/applicationCycle";

const loadTraineeResolver: any = {
  Query: {
    async getAllTraineeApplicant() {
      const trainees = await TraineeApplicant.find({}).populate("cycle_id");
      return trainees;
    },
    async getAllTraineeAtributes() {
      const traineesAttribute = await traineEAttributes.find({}).populate({
        path: "trainee_id",
        populate: {
          path: "cycle_id",
          model: "applicationCycle",
        },
      });
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
          "cycle_name",
        ];

        // const getIndexArrOfTheTrainee = (correctColumnOfProperty: string[]) => {
        //   const arrayOfTraineeProperties = ["firstName", "lastName", "email"];
        //   const traineeIndexArray = [];
        //   for (let i = 0; i < arrayOfTraineeProperties.length; i++) {
        //     // @ts-ignore
        //     if (correctColumnOfProperty.includes(arrayOfTraineeProperties[i])) {
        //       // @ts-ignore
        //       const index = correctColumnOfProperty.indexOf(
        //         arrayOfTraineeProperties[i]
        //       );
        //       traineeIndexArray.push(index);
        //     }

        //     // If the indexes of trainees is yet captured, do not continue to iterate on the array,
        //     // JUST GO OUT OF THE LOOP as the purpose of iterating is already achieved!
        //     if (traineeIndexArray.length === 3) continue
        //   }
        //   return traineeIndexArray;
        // };

        // const giveMeDataInACorrectFormatTrainee = (
        //   arrOfAllRows: any,
        //   correctColumnArr: any,
        //   arrOfTraineeIndexes: any
        // ) => {
        //   const arrOfObject = [];

        //   for (let i = 1; i < arrOfAllRows.length; i++) {
        //     // th data format of arrOfAllRows is
        //     // As the length of the indexes of the array is well known and should be three as it is representing,
        //     // three datafields; email, firstName and secondName. so we can get them automatically by accessing them
        //     // through index 0, 1, 2.
        //     arrOfObject.push({
        //       [correctColumnArr[arrOfTraineeIndexes[0]]]:
        //         arrOfAllRows[i][arrOfTraineeIndexes[0]],
        //       [correctColumnArr[arrOfTraineeIndexes[1]]]:
        //         arrOfAllRows[i][arrOfTraineeIndexes[1]],
        //       [correctColumnArr[arrOfTraineeIndexes[2]]]:
        //         arrOfAllRows[i][arrOfTraineeIndexes[2]],
        //     });
        //   }
        //   return arrOfObject;
        // };

        // some of the data received from the table contains the yes or no values while in the database schema
        // it is declared as boolean either true or false. So this function is there to loop through them
        // and replace true or false where it found yes or no.
        const replaceNoOrYesWithTrueOrFalseFunc = (dataObject: any) => {
          let finObject = { ...dataObject };
          // note that since the datafields which normally receives the no or yes response are known,
          // we can hardcode them and they are : isEmployed, haveLaptop, isStudent.
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

        const giveMeDataOfAttributesAndTraineesSeparately = (
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
          // @ts-ignore

          const arrOfTraineesAndAttributes = [];
          for (let Item of arrOfObject) {
            // @ts-ignore
            const cycle_id = Item["cycle_name"];
            // create the object of the trainees swapped from the general
            // object containing all of the datas from the table
            const traineesObject = {
              // @ts-ignore
              firstName: Item.firstName,
              // @ts-ignore
              lastName: Item.lastName,
              // @ts-ignore
              email: Item.email,
            };
            // Remove the ones which pertains to the trainees, which are email, firstName and lastName.
            // @ts-ignore
            delete Item["firstName"];
            // @ts-ignore
            delete Item["lastName"];
            // @ts-ignore
            delete Item["email"];
            // @ts-ignore
            delete Item["cycle_name"];
            // go to replace the no or  yes values with the true and false values as they are the ones which are required
            // when saving them in the database
            const attributesObject = replaceNoOrYesWithTrueOrFalseFunc(Item);
            arrOfTraineesAndAttributes.push({
              trainees: traineesObject,
              attributes: attributesObject,
              cycle_id: cycle_id,
            });
          }

          // const arrOfTraineesAndAttributes = arrOfObject.map((item: any) => {
          //   const cycle_id = item["cycle_name"];
          //   // create the object of the trainees swapped from the general
          //   // object containing all of the datas from the table
          //   const traineesObject = {
          //     firstName: item.firstName,
          //     lastName: item.lastName,
          //     email: item.email,
          //   };
          //   // Remove the ones which pertains to the trainees, which are email, firstName and lastName.
          //   delete item["firstName"];
          //   delete item["lastName"];
          //   delete item["email"];
          //   delete item["cycle_name"];
          //   // go to replace the no or  yes values with the true and false values as they are the ones which are required
          //   // when saving them in the database
          //   const attributesObject = replaceNoOrYesWithTrueOrFalseFunc(item);
          //   return {
          //     trainees: traineesObject,
          //     attributes: attributesObject,
          //     cycle_id: cycle_id,
          //   };
          // });

          return arrOfTraineesAndAttributes;
        };

        const SPValuesArr: any = rows.data.values;

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
          const attributesAndTraineesArray =
            giveMeDataOfAttributesAndTraineesSeparately(
              rows?.data?.values,
              correctColumn
            );

          // @ts-ignore
          const promisesForCycles = [];
          const promisesForTrainees = [];
          const promisesForAttributes = [];

          for (let i = 0; i < rows.data?.values?.length - 1; i++) {
            // find cycles  and return just _id field only because it is what is need ONLY
            const cycle = applicationCycle.findOne(
              {
                name: attributesAndTraineesArray[i].cycle_id,
              },
              {
                projection: { _id: 1 },
              }
            );
            promisesForCycles.push(cycle);
          }
          const cycles = await Promise.all(promisesForCycles);

          // loop through all of the data in the array and save them but INSTEAD OF AWAITING ALL OF THEM EACH TIME,
          // use promise.all to await all of them at once after loop.
          for (let i = 0; i < rows.data?.values?.length - 1; i++) {
            const trainee = TraineeApplicant.create({
              ...attributesAndTraineesArray[i].trainees,
              cycle_id: cycles[i]?._id,
            });
            promisesForTrainees.push(trainee);
          }
          const trainees = await Promise.all(promisesForTrainees);

          for (let i = 0; i < rows.data?.values?.length - 1; i++) {
            const traineeAttribute = traineEAttributes.create({
              ...attributesAndTraineesArray[i].attributes,
              trainee_id: trainees[i]._id,
            });
            promisesForAttributes.push(traineeAttribute);
          }
          const attributes = await Promise.all(promisesForAttributes);
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
      const arrOfValues = Object.values(columnData);

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
      const replaceNoOrYesWithTrueOrFalseFunc = (dataObject: any) => {
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
      const giveMeDataOfAttributesAndTraineesSeparately = (
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
        // @ts-ignore

        const arrOfTraineesAndAttributes = [];
        for (let Item of arrOfObject) {
          // @ts-ignore
          const cycle_id = Item["cycle_name"];
          // create the object of the trainees swapped from the general
          // object containing all of the datas from the table
          const traineesObject = {
            // @ts-ignore
            firstName: Item.firstName,
            // @ts-ignore
            lastName: Item.lastName,
            // @ts-ignore
            email: Item.email,
          };
          // Remove the ones which pertains to the trainees, which are email, firstName and lastName.
          // @ts-ignore
          delete Item["firstName"];
          // @ts-ignore
          delete Item["lastName"];
          // @ts-ignore
          delete Item["email"];
          // @ts-ignore
          delete Item["cycle_name"];
          // go to replace the no or  yes values with the true and false values as they are the ones which are required
          // when saving them in the database
          const attributesObject = replaceNoOrYesWithTrueOrFalseFunc(Item);
          arrOfTraineesAndAttributes.push({
            trainees: traineesObject,
            attributes: attributesObject,
            cycle_id: cycle_id,
          });
        }
        return arrOfTraineesAndAttributes;
      };

      // @ts-ignore
      const correctColumn = replaceToGetCorrectColumn(rows?.data?.values[0]);
      
      const attributesAndTraineesArray =
        giveMeDataOfAttributesAndTraineesSeparately(
          rows?.data?.values,
          correctColumn
        );
      const promisesForCycles = [];
      const promisesForTrainees = [];
      const promisesForAttributes = [];
      // @ts-ignore
      for (let i = 0; i < rows.data?.values?.length - 1; i++) {
        // find cycles  and return just _id field only because it is what is need ONLY
        const cycle = applicationCycle.findOne(
          {
            name: attributesAndTraineesArray[i].cycle_id,
          },
          {
            projection: { _id: 1 },
          }
        );
        promisesForCycles.push(cycle);
      }
      const cycles = await Promise.all(promisesForCycles);
      // @ts-ignore
      for (let i = 0; i < rows.data?.values?.length - 1; i++) {
        const trainee = TraineeApplicant.create({
          ...attributesAndTraineesArray[i].trainees,
          cycle_id: cycles[i]?._id,
        });
        promisesForTrainees.push(trainee);
      }
      const trainees = await Promise.all(promisesForTrainees);
      // @ts-ignore
      for (let i = 0; i < rows.data?.values?.length - 1; i++) {
        const traineeAttribute = traineEAttributes.create({
          ...attributesAndTraineesArray[i].attributes,
          trainee_id: trainees[i]._id,
        });
        promisesForAttributes.push(traineeAttribute);
      }
      const attributes = await Promise.all(promisesForAttributes);
      // }
      return "The data mapped has been saved successfully, CONGRATS";
    },
  },
};

export default loadTraineeResolver;
