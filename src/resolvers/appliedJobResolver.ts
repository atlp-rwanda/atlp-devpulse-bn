import { google } from "googleapis";
import { AppliedJobModel } from "../models/appliedJob";
import { TrackSheet } from "../models/trackAppliedJob";
import { CustomGraphQLError } from "../utils/customErrorHandler";

// Extract sheet ID from Google Sheet URL
function extractSheetId(sheetUrl: string): string | null {
  const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = sheetUrl.match(regex);
  return match ? match[1] : null;
}

// Get all sheet names from the spreadsheet
async function getAllSheets(sheetId: string) {
  const googleSheets = google.sheets({ version: "v4" });
  const response = await googleSheets.spreadsheets.get({
    spreadsheetId: sheetId,
    key: process.env.API_KEYS,
  });

  // Extract sheet names from response
  const sheets = response.data.sheets?.map((sheet) => sheet.properties?.title);
  return sheets || [];
}

// Fetch data from a specific sheet
async function fetchSheetData(sheetId: string, sheetName: string) {
  const googleSheets = google.sheets({ version: "v4" });
  const response = await googleSheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: sheetName, // Get all data for the sheet
    key: process.env.API_KEYS,
  });

  return response.data.values;
}

// Fetch all data from all sheets in a spreadsheet
async function fetchAllSheetData(sheetLink: string) {
  const sheetId = extractSheetId(sheetLink);
  if (!sheetId) {
    throw new Error("Invalid sheet link provided");
  }

  // Get all sheet names
  const sheets = await getAllSheets(sheetId);

  // Fetch data from each sheet
  const allSheetData = await Promise.all(
    sheets.map(async (sheetName: any) => {
      const data = await fetchSheetData(sheetId, sheetName);
      return {
        sheetName,
        data,
      };
    })
  );

  return allSheetData;
}

// Get the last processed timestamp from MongoDB
async function getLastProcessedTimestamp(sheetId: string): Promise<string> {
  const sheetTracker = await TrackSheet.findOne({ sheetId });
  return sheetTracker
    ? sheetTracker.lastProcessedTimestamp.toISOString()
    : new Date("2024-01-01T00:00:00Z").toISOString();
}

// Update the last processed timestamp in MongoDB
async function updateLastProcessedTimestamp(
  sheetId: string,
  lastTimestamp: string
): Promise<number> {
  const updatedSheetTracker = await TrackSheet.updateOne(
    { sheetId },
    { $set: { lastProcessedTimestamp: lastTimestamp } },
    { upsert: true, new: true }
  );
  return updatedSheetTracker.upsertedCount || 0;
}
export const processSheetData = async (sheetLink: string): Promise<boolean> => {
  try {
    // Fetch all data from all sheets
    const allSheetData = await fetchAllSheetData(sheetLink);

    const sheetId = extractSheetId(sheetLink);
    if (!sheetId) {
      throw new Error("Invalid sheet link provided");
    }

    // Get the last processed timestamp
    const lastProcessedTimestamp = await getLastProcessedTimestamp(sheetId);

    for (const { sheetName, data } of allSheetData) {
      if (!data || data.length === 0) continue; // Skip empty sheets

      const headers = data[0];
      const timestampIndex = headers.indexOf("Timestamp");
      if (timestampIndex === -1) {
        throw new Error(`Timestamp column not found in sheet: ${sheetName}`);
      }

      const newRows = data.slice(1).filter((row: any) => {
        const rowTimestamp = row[timestampIndex];
        return (
          rowTimestamp &&
          new Date(rowTimestamp) > new Date(lastProcessedTimestamp)
        );
      });

      if (newRows.length === 0) continue;

      const documents = newRows.map((row: any) => {
        const document: { [key: string]: any } = {};
        headers.forEach((header: string, index: number) => {
          document[header] = row[index] || null;
        });
        return { appliedJob: document };
      });

      await AppliedJobModel.insertMany(documents);

      const latestTimestamp = newRows[newRows.length - 1][timestampIndex];
      await updateLastProcessedTimestamp(sheetId, latestTimestamp);
    }
    return true;
  } catch (error: any) {
    throw new CustomGraphQLError(`Something went wrong: ${error.message}`);
  }
};
export const appliedJobResolver = {
  Query: {
    getAllAppliedJobs: async (_: any, __: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view applications."
          );
        }

        const appliedJobs = await AppliedJobModel.find({}).lean();
        console.log(appliedJobs);
        if (appliedJobs.length === 0) {
          throw new Error("No applications found.");
        }

        const jobApplications = appliedJobs.map((appliedJob) => {
          const fieldData = Object.entries(appliedJob.appliedJob as any).map(
            ([key, value]) => ({
              key,
              value: value ? String(value) : null, // Convert value to string or null
            })
          );
          return {
            id: appliedJob._id.toString(),
            appliedJob: fieldData,
            status: appliedJob.status,
          };
        });
        return jobApplications;
      } catch (error: any) {
        throw new Error(`Error retrieving applications: ${error.message}`);
      }
    },

    getAppliedJob: async (_: any, { id }: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view your application."
          );
        }

        const appliedJob = await AppliedJobModel.findById(id).lean();

        if (!appliedJob) {
          throw new Error("Application not found or you are unauthorized.");
        }

        const data =
          appliedJob.appliedJob instanceof Map
            ? Object.fromEntries(appliedJob.appliedJob)
            : appliedJob.appliedJob;

        const fieldData = Object.entries(data as any).map(([key, value]) => ({
          key,
          value: value ? String(value) : null,
        }));

        return {
          id: appliedJob._id.toString(),
          appliedJob: fieldData,
          status:appliedJob.status
        };
      } catch (error: any) {
        throw new Error(`Error retrieving application: ${error.message}`);
      }
    },
    getMyOwnAppliedJob: async (_: any, __: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view your application."
          );
        }
        const appliedJobs = await AppliedJobModel.find({
          $or: [
            { "appliedJob.UserID": context.currentUser._id.toString() },
            { "appliedJob.Email": context.currentUser.email },
          ],
        }).lean();
        console.log(appliedJobs);
        if (!appliedJobs) {
          throw new Error("Application not found or you are unauthorized.");
        }
        const jobApplications = appliedJobs.map((appliedJob) => {
          const fieldData = Object.entries(appliedJob.appliedJob as any).map(
            ([key, value]) => ({
              key,
              value: value ? String(value) : null, // Convert value to string or null
            })
          );
          return {
            id: appliedJob._id.toString(),
            appliedJob: fieldData,
            status: appliedJob.status,
          };
        });
        return jobApplications;
      } catch (error: any) {
        throw new Error(`Error retrieving application: ${error.message}`);
      }
    },
  },

  Mutation: {
    saveSheetData: async (_: any, { sheetLink }: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view applications."
          );
        }

        // Fetch all data from all sheets
        const allSheetData = await fetchAllSheetData(sheetLink);

        const sheetId = extractSheetId(sheetLink);
        if (!sheetId) {
          throw new Error("Invalid sheet link provided");
        }

        // Get the last processed timestamp
        const lastProcessedTimestamp = await getLastProcessedTimestamp(sheetId);

        for (const { sheetName, data } of allSheetData) {
          if (!data || data.length === 0) continue; // Skip empty sheets

          const headers = data[0];
          const timestampIndex = headers.indexOf("Timestamp");
          if (timestampIndex === -1) {
            throw new Error(
              `Timestamp column not found in sheet: ${sheetName}`
            );
          }

          const newRows = data.slice(1).filter((row: any) => {
            const rowTimestamp = row[timestampIndex];
            return (
              rowTimestamp &&
              new Date(rowTimestamp) > new Date(lastProcessedTimestamp)
            );
          });

          if (newRows.length === 0) continue;

          const documents = newRows.map((row: any) => {
            const document: { [key: string]: any } = {};
            headers.forEach((header: string, index: number) => {
              document[header] = row[index] || null;
            });
            return { data: document };
          });

          await AppliedJobModel.insertMany(documents);

          const latestTimestamp = newRows[newRows.length - 1][timestampIndex];
          await updateLastProcessedTimestamp(sheetId, latestTimestamp);
        }

        return true;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
