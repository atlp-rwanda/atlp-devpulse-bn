import { google } from "googleapis";
import { AppliedJobModel } from "../models/appliedJob";
import { TrackSheet } from "../models/trackAppliedJob";
import { CustomGraphQLError } from "../utils/customErrorHandler";

function extractSheetId(sheetUrl: string): string | null {
  const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = sheetUrl.match(regex);
  return match ? match[1] : null;
}

async function fetchSheetData(sheetLink: string, sheetName: string) {
  const sheetId = extractSheetId(sheetLink);
  if (!sheetId) {
    throw new Error("Invalid sheet link provided");
  }
  const googleSheets = google.sheets({ version: "v4" });

  const response = await googleSheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: sheetName,
    key: process.env.API_KEYS,
  });

  return response.data.values;
}

async function getLastProcessedRow(sheetId: string): Promise<number> {
  const sheetTracker = await TrackSheet.findOne({ sheetId });
  return sheetTracker ? sheetTracker.lastProcessedRow : 0;
}

async function updateLastProcessedRow(
  sheetId: string,
  lastRow: number
): Promise<number> {
  const updatedSheetTracker = await TrackSheet.updateOne(
    { sheetId },
    { $set: { lastProcessedRow: lastRow } },
    { upsert: true, new: true }
  );
  return updatedSheetTracker.upsertedCount || 0;
}

export const appliedJobResolver = {
  Query: {
    getAllAppliedJobs: async (_: any, __: any, context: any) => {
      try {
        // Ensure the user is authenticated
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view applications."
          );
        }

        // Fetch all applied jobs from the MongoDB collection
        const appliedJobs = await AppliedJobModel.find({}).lean();

        // If no jobs found, throw an error
        if (appliedJobs.length === 0) {
          throw new Error("No applications found.");
        }

        // Map each job document to the required GraphQL structure
        return appliedJobs.map((job: any) => {
          // Convert the document fields to key-value pairs
          const fieldData = Object.keys(job.data).map((key) => ({
            key,
            value: job.data[key] ? String(job.data[key]) : null, // Ensure values are strings or null
          }));

          // Return the mapped object with an ID and key-value pair data
          return {
            id: job._id.toString(), // Convert MongoDB ObjectId to string
            data: fieldData, // Field data as key-value pairs
          };
        });
      } catch (error: any) {
        throw new Error(`Error retrieving applications: ${error.message}`);
      }
    },
    getAppliedJob: async (_: any, { id }: any, context: any) => {
      try {
        // Ensure the user is authenticated
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view your application."
          );
        }

        // Fetch the applied job from the MongoDB collection by ID
        const appliedJob = await AppliedJobModel.findById(id).lean();

        // If no job found, throw an error
        if (!appliedJob) {
          throw new Error("Application not found or you are unauthorized.");
        }

        const data =
          appliedJob.data instanceof Map
            ? Object.fromEntries(appliedJob.data)
            : appliedJob.data;

        // Map through all key-value pairs in the plain object
        const fieldData = Object.entries(data as any).map(([key, value]) => ({
          key,
          value: value ? String(value) : null, // Convert to string or null
        }));

        // Return the mapped object with an ID and key-value pair data
        return {
          id: appliedJob._id.toString(),
          data: fieldData, // Return all field data as an array of FieldData
        };
      } catch (error: any) {
        throw new Error(`Error retrieving application: ${error.message}`);
      }
    },
  },

  Mutation: {
    saveSheetData: async (_: any, { sheetLink, range }: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view applications."
          );
        }
        const data: any = await fetchSheetData(sheetLink, range);
        if (!data || data.length === 0) {
          throw new Error("No data found in the provided range");
        }
        const sheetId = extractSheetId(sheetLink);
        if (!sheetId) {
          throw new Error("Invalid sheet link provided");
        }
        const headers = data[0];
        const lastRow = await getLastProcessedRow(sheetId);

        const newRows = data.slice(lastRow);

        const filteredRows = newRows.filter((row: any) =>
          row.some((cell: any) => cell)
        );

        if (filteredRows.length === 0) {
          throw new Error("No valid data rows to process.");
        }

        const documents = filteredRows.map((row: any) => {
          const document: { [key: string]: any } = {};
          headers.forEach((header: string, index: number) => {
            document[header] = row[index] || null;
          });
          return { data: document };
        });

        await AppliedJobModel.insertMany(documents);

        const newLastRow = lastRow + filteredRows.length;
        await updateLastProcessedRow(sheetId, newLastRow);

        return true;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
