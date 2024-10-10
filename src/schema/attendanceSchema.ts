import { gql } from "apollo-server";
export const attendanceSchema = gql`
    type Attendance {
        id: ID!
        trainee: ID!
        date: String!
        status: AttendanceStatus!
    }

    enum AttendanceStatus {
        Present
        Absent
    }

    type AttendanceResponse {
        attendances: [Attendance!]!
        attendanceRatio: String!
    }

    type Query {
        getTraineeAttendance(traineeId: ID!): AttendanceResponse!
    }

    input MarkAttendanceInput {
        trainee: ID!
        date: String!
        status: AttendanceStatus!
    }

    type Mutation {
        markAttendance(input: MarkAttendanceInput): Attendance!
    }

`