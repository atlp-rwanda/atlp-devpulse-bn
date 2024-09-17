import TraineeApplicant from "../models/traineeApplicant.js";
import { traineEAttributes } from "../models/traineeAttribute.js";
import { google } from "googleapis";
import { applicationCycle } from "../models/applicationCycle.js";

// some of the data received from the table contains the yes or no values while as in the database schema
// it is declared as booleans; either true or false. So this function is there to loop through them
// and replace true or false where it found yes or no.
const replaceNoOrYesWithTrueOrFalseFunc = (attributesDataObjectInput: any) => {
  let finalAttributeObject = { ...attributesDataObjectInput };
  // note that since the datafields which normally receives the no or yes response are known,
  // we can hardcode them and they are : isEmployed, haveLaptop, isStudent.
  if (attributesDataObjectInput.isEmployed.toLowerCase() === "no") {
    finalAttributeObject = {
      ...finalAttributeObject,
      isEmployed: false,
    };
  }
  if (attributesDataObjectInput.haveLaptop.toLowerCase() === "no") {
    finalAttributeObject = {
      ...finalAttributeObject,
      haveLaptop: false,
    };
  }
  if (attributesDataObjectInput.isStudent.toLowerCase() === "no") {
    finalAttributeObject = {
      ...finalAttributeObject,
      isStudent: false,
    };
  }
  if (attributesDataObjectInput.isStudent.toLowerCase() === "yes") {
    finalAttributeObject = {
      ...finalAttributeObject,
      isStudent: true,
    };
  }
  if (attributesDataObjectInput.haveLaptop.toLowerCase() === "yes") {
    finalAttributeObject = {
      ...finalAttributeObject,
      haveLaptop: true,
    };
  }
  if (attributesDataObjectInput.isEmployed.toLowerCase() === "yes") {
    finalAttributeObject = {
      ...finalAttributeObject,
      isEmployed: true,
    };
  }
  return finalAttributeObject;
};

// The data captured from the table comes whereby the all the datas for trainees which are email, firstName and
// lastName and the datas for attributes COME TOGETHERS AS A ONE OBJECT, but when saving them in the mongo database
// they should be saved separately on each collections. So there needs a way to seperate them.

// This function is separating them so that the datas of trainees are on the one object and the datas for the
// attributes are on the other object.
const giveMeDataOfAttributesAndTraineesSeparately = (
  arraysOfRawDataFromGoogleSheetInput: any,
  arrayOfCorrectColumnInput: any
) => {
  const arrayOfEachRowDatasInObjectFormat = [];
  for (let i = 1; i < arraysOfRawDataFromGoogleSheetInput.length; i++) {
    arrayOfEachRowDatasInObjectFormat.push({
      [arrayOfCorrectColumnInput[3]]: arraysOfRawDataFromGoogleSheetInput[i][3],
      [arrayOfCorrectColumnInput[4]]: arraysOfRawDataFromGoogleSheetInput[i][4],
      [arrayOfCorrectColumnInput[5]]: arraysOfRawDataFromGoogleSheetInput[i][5],
      [arrayOfCorrectColumnInput[6]]: arraysOfRawDataFromGoogleSheetInput[i][6],
      [arrayOfCorrectColumnInput[7]]: arraysOfRawDataFromGoogleSheetInput[i][7],
      [arrayOfCorrectColumnInput[8]]: arraysOfRawDataFromGoogleSheetInput[i][8],
      [arrayOfCorrectColumnInput[9]]: arraysOfRawDataFromGoogleSheetInput[i][9],
      [arrayOfCorrectColumnInput[10]]:
        arraysOfRawDataFromGoogleSheetInput[i][10],
      [arrayOfCorrectColumnInput[11]]:
        arraysOfRawDataFromGoogleSheetInput[i][11],
      [arrayOfCorrectColumnInput[12]]:
        arraysOfRawDataFromGoogleSheetInput[i][12],
      [arrayOfCorrectColumnInput[13]]:
        arraysOfRawDataFromGoogleSheetInput[i][13],
      [arrayOfCorrectColumnInput[14]]:
        arraysOfRawDataFromGoogleSheetInput[i][14],
      [arrayOfCorrectColumnInput[15]]:
        arraysOfRawDataFromGoogleSheetInput[i][15],
      [arrayOfCorrectColumnInput[16]]:
        arraysOfRawDataFromGoogleSheetInput[i][16],
      [arrayOfCorrectColumnInput[17]]:
        arraysOfRawDataFromGoogleSheetInput[i][17],
      [arrayOfCorrectColumnInput[18]]:
        arraysOfRawDataFromGoogleSheetInput[i][18],
      [arrayOfCorrectColumnInput[19]]:
        arraysOfRawDataFromGoogleSheetInput[i][19],
      [arrayOfCorrectColumnInput[20]]:
        arraysOfRawDataFromGoogleSheetInput[i][20],
      [arrayOfCorrectColumnInput[0]]: arraysOfRawDataFromGoogleSheetInput[i][0],
      [arrayOfCorrectColumnInput[1]]: arraysOfRawDataFromGoogleSheetInput[i][1],
      [arrayOfCorrectColumnInput[2]]: arraysOfRawDataFromGoogleSheetInput[i][2],
    });
  }
  // @ts-ignore

  const arrOfTraineesAndAttributes = [];
  for (let RowDataObject of arrayOfEachRowDatasInObjectFormat) {
    // @ts-ignore
    const cycle_id = RowDataObject["cycle_name"];

    // create the object of the trainees swapped from the general
    // object containing all of the datas from the google sheet table
    const traineesObject = {
      // @ts-ignore
      firstName: RowDataObject.firstName,
      // @ts-ignore
      lastName: RowDataObject.lastName,
      // @ts-ignore
      email: RowDataObject.email,
    };

    // Remove the properties from the object which pertains to the trainees, which are email, firstName and lastName and also reomove cycle_name.
    // ==========================================================================================================================================

    // @ts-ignore
    // This 'delete' is mutating the object such that "IT DELETES THE PROPERTIESD AND ITS VALUES FROM THE OBJECT"
    // by refering to its properties name.
    delete RowDataObject["firstName"];

    // @ts-ignore
    // This 'delete' is mutating the object such that "IT DELETES THE PROPERTIESD AND ITS VALUES FROM THE OBJECT"
    // by refering to its properties name.
    delete RowDataObject["lastName"];

    // @ts-ignore
    // This 'delete' is mutating the object such that "IT DELETES THE PROPERTIESD AND ITS VALUES FROM THE OBJECT"
    // by refering to its properties name.
    delete RowDataObject["email"];

    // @ts-ignore
    // This 'delete' is mutating the object such that "IT DELETES THE PROPERTIESD AND ITS VALUES FROM THE OBJECT"
    // by refering to its properties name.
    delete RowDataObject["cycle_name"];

    // Now AT THIS STEP/STAGE; as the properties firstName, lastName, email and cycle_name ARE DELETED FROM THE RowDataObject,
    // Then the RowDataObject now contains "only" the properties of the attributes SOLELY.

    // go to replace the no or  yes values with the true and false values as they are the ones which are required
    // when saving them in the database
    const attributesObject = replaceNoOrYesWithTrueOrFalseFunc(RowDataObject);

    // This is array of trainees and attributes will have this "FORMAT"
    // Begin ====>>>
    // [
    //   {
    //     trainees: {
    //       firstname: "eric",
    //       email: "eric@gmail.com",
    //       lastName: "panga",
    //     },
    //     attributes: {
    //       gender: "male",
    //       birth_date: "12/10/2022",
    //       phone: "0783520201",
    //       field_of_study: "Mechanical Engineering",
    //       education_level: "Bachelor degree",
    //       province: "Kigali city",
    //       district: "Gasabo",
    //       isEmployed: false,
    //       isStudent: true,
    //       Hackerrank_score: 80,
    //       english_score: 60,
    //       interview: 90,
    //       interview_decision: "Passed",
    //       past_andela_programs: "Dev pulse introduction",
    //       Address: "KG 202 Street",
    //       sector: "Remera",
    //       haveLaptop: false,
    //       cycle_name: "Cycle 1",
    //     },
    //     cycle_id: "1263hbdaDGJDGBMCB,ANXJhdajkhsjkbdjhB",
    //   },
    //   {
    //     trainees: {
    //       firstname: "eric",
    //       email: "eric@gmail.com",
    //       lastName: "panga",
    //     },
    //     attributes: {
    //       gender: "male",
    //       birth_date: "12/10/2022",
    //       phone: "0783520201",
    //       field_of_study: "Mechanical Engineering",
    //       education_level: "Bachelor degree",
    //       province: "Kigali city",
    //       district: "Gasabo",
    //       isEmployed: false,
    //       isStudent: true,
    //       Hackerrank_score: 80,
    //       english_score: 60,
    //       interview: 90,
    //       interview_decision: "Passed",
    //       past_andela_programs: "Dev pulse introduction",
    //       Address: "KG 202 Street",
    //       sector: "Remera",
    //       haveLaptop: false,
    //       cycle_name: "Cycle 1",
    //     },
    //     cycle_id: "1263hbdaDGJDGBMCB,ANXJhdajkhsjkbdjhB",
    //   },
    //   {
    //     trainees: {
    //       firstname: "eric",
    //       email: "eric@gmail.com",
    //       lastName: "panga",
    //     },
    //     attributes: {
    //       gender: "male",
    //       birth_date: "12/10/2022",
    //       phone: "0783520201",
    //       field_of_study: "Mechanical Engineering",
    //       education_level: "Bachelor degree",
    //       province: "Kigali city",
    //       district: "Gasabo",
    //       isEmployed: false,
    //       isStudent: true,
    //       Hackerrank_score: 80,
    //       english_score: 60,
    //       interview: 90,
    //       interview_decision: "Passed",
    //       past_andela_programs: "Dev pulse introduction",
    //       Address: "KG 202 Street",
    //       sector: "Remera",
    //       haveLaptop: false,
    //       cycle_name: "Cycle 1",
    //     },
    //     cycle_id: "1263hbdaDGJDGBMCB,ANXJhdajkhsjkbdjhB",
    //   },
    // ];
    // <<<==== End.
    arrOfTraineesAndAttributes.push({
      // trainees on the separate object
      trainees: traineesObject,

      // attributes on the separate object of its own.
      attributes: attributesObject,

      // And cycle Id on its own
      cycle_id: cycle_id,
    });
  }
  return arrOfTraineesAndAttributes;
};

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

        const googleSheets = google.sheets("v4");

        // Get ID for the arguments passed when calling this api on the front end.
        const spreadsheetId = _args.spreadsheetId;

        //read rows from spreadsheet by using the auth, spreadSheetId, and the the range or the which sheet
        // doeas the data to be imported belongs to.
        const rows = await googleSheets.spreadsheets.values.get({
          auth,
          spreadsheetId,
          range: "Sheet1",
        });

        // Capture the data from the google sheet table.
        // It comes it this "FORMAT"
        // Begin ===>>>
        //
        //
        // <<<=== End.
        const arraysOfRawDataFromGoogleSheet: any = rows.data.values;

        // the array preserved tohold the names of the columns which do not match with
        // those in the database definition
        let arrayContainingUnmatchedColumns: any = [];

        // the array containing the correct format of the columns which is in the database definition
        // and this should be the ones that the user should provide.
        //  so that is why it is used to validate or check if all of the column passed matches them all,
        // If they match, it means that the user provided the correct naming of the column,
        // But if they do not match, It means that the columns are not matching and the mapping should be done to match them !!!
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

        // @ts-ignore
        const promisesForCycles = [];
        const promisesForTrainees = [];
        const promisesForAttributes = [];

        //loop through rows and add them to our db
        if (
          arraysOfRawDataFromGoogleSheet !== undefined &&
          arraysOfRawDataFromGoogleSheet !== null
        ) {
          const arrayOfColumnsOfTheGoogleSheetTable =
            arraysOfRawDataFromGoogleSheet[0];
          for (
            let i = 0;
            i < arrayOfColumnsOfTheGoogleSheetTable?.length;
            i++
          ) {
            if (
              !validationArray.includes(arrayOfColumnsOfTheGoogleSheetTable[i])
            ) {
              arrayContainingUnmatchedColumns.push(
                arrayOfColumnsOfTheGoogleSheetTable[i]
              );
            }
          }
          // If there any unmtched columns provided which is not among the known names of the columns
          // Return lists of those unmtched columns so that they will be matched on the fron-end.

          if (arrayContainingUnmatchedColumns.length !== 0) {
            throw new Error(`${arrayContainingUnmatchedColumns}`);
          }

          // but if there is no error just save them or him into database.

          // As the columns are matching to those in the database definition,
          // The first item in the array of the data from google sheet is the one containing the
          // the names of the columns which is  going to be the field of the data in the database.
          const arrayOfCorrectColumns = arraysOfRawDataFromGoogleSheet[0];
          const attributesAndTraineesArray =
            giveMeDataOfAttributesAndTraineesSeparately(
              arraysOfRawDataFromGoogleSheet,
              arrayOfCorrectColumns
            );

          for (let i = 0; i < arraysOfRawDataFromGoogleSheet?.length - 1; i++) {
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
          for (let i = 0; i < arraysOfRawDataFromGoogleSheet?.length - 1; i++) {
            const trainee = TraineeApplicant.create({
              ...attributesAndTraineesArray[i].trainees,
              cycle_id: cycles[i]?._id,
            });
            promisesForTrainees.push(trainee);
          }
          const trainees = await Promise.all(promisesForTrainees);

          for (let i = 0; i < arraysOfRawDataFromGoogleSheet?.length - 1; i++) {
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
      const googleSheets = google.sheets("v4");

      //read rows from spreadsheet
      const spreadsheetId = _args.columnData.spreadsheetId;
      const rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
      });
      //  capture the mapped objects with their names as the values
      const { columnData } = _args;

      // produce array of the properties(keys) from the object coming from the mapping.
      const arrayOfPropertiesFromMapping = Object.keys(columnData);
      // produce array of the values from the object coming from the mapping.
      const arrayOfValuesFromMapping = Object.values(columnData);

      const arraysOfRawDataFromGoogleSheet: any = rows.data.values;

      const promisesForCycles = [];
      const promisesForTrainees = [];
      const promisesForAttributes = [];

      // This is the core to the functionality of the mapping.
      // =====================================================

      // This function is producing the correct column from the mapped columns and it is replacing the mapped values
      // to the same exact place in the normal first columns array of the google sheet table.
      const replaceTheMappedValuesInTheNormalColumnsFromTableFunc = (
        arrayOfColumnsOfTheGoogleSheetTable: string[],
        arrayOfValuesFromMappingInput: any,
        arrayOfPropertiesFromMappingInput: any
      ) => {
        for (let i = 0; i < arrayOfColumnsOfTheGoogleSheetTable.length; i++) {
          // @ts-ignore
          if (
            arrayOfColumnsOfTheGoogleSheetTable.includes(
              arrayOfValuesFromMappingInput[i]
            )
          ) {
            // @ts-ignore
            const index = arrayOfColumnsOfTheGoogleSheetTable.indexOf(
              arrayOfValuesFromMappingInput[i]
            );
            // If there is a mapped item in the normal columns array from the table,
            // Mutate it to change the values of it to the mapped values from the front end.
            // Note that the "keys or arrayOfPropertiesFromMappingInput"are the normal/correct names of the columns as they have defined in the
            // database.
            // While the "values or arrayOfValuesFromMappingInput" are the names of the columns as they have been in the googlesheet table
            // from the user before mapping.
            // The only difference is that the user mapped them so that for example the email is mapped to the Email, gender is mapped to the GENDERS, interview is mapped to the Interviewing.
            //  like this one: { firstname: first Name, email: Email, lastName: Second Name }

            // this "SPLICE" function is changing the items in the array to the same exact place as depicted by the 'index' with
            // the new values provided as the 'third argument'.
            arrayOfColumnsOfTheGoogleSheetTable.splice(
              index,
              1,
              arrayOfPropertiesFromMappingInput[i]
            );
          }
        }

        // Then after replacing all of the required values,
        // return the array as it has been mutated where it was neccesary by the "splice function".
        return arrayOfColumnsOfTheGoogleSheetTable;
      };

      // @ts-ignore
      const arrayOfCorrectColumns =
        replaceTheMappedValuesInTheNormalColumnsFromTableFunc(
          arraysOfRawDataFromGoogleSheet[0],
          arrayOfValuesFromMapping,
          arrayOfPropertiesFromMapping
        );

      const attributesAndTraineesArray =
        giveMeDataOfAttributesAndTraineesSeparately(
          arraysOfRawDataFromGoogleSheet,
          arrayOfCorrectColumns
        );

      // @ts-ignore
      for (let i = 0; i < arraysOfRawDataFromGoogleSheet?.length - 1; i++) {
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
      for (let i = 0; i < arraysOfRawDataFromGoogleSheet?.length - 1; i++) {
        const trainee = TraineeApplicant.create({
          ...attributesAndTraineesArray[i].trainees,
          cycle_id: cycles[i]?._id,
        });
        promisesForTrainees.push(trainee);
      }
      const trainees = await Promise.all(promisesForTrainees);
      // @ts-ignore
      for (let i = 0; i < arraysOfRawDataFromGoogleSheet?.length - 1; i++) {
        const traineeAttribute = traineEAttributes.create({
          ...attributesAndTraineesArray[i].attributes,
          trainee_id: trainees[i]._id,
        });
        promisesForAttributes.push(traineeAttribute);
      }
      const attributes = await Promise.all(promisesForAttributes);

      return "The data mapped has been saved successfully, CONGRATS";
    },
  },
};

export default loadTraineeResolver;
