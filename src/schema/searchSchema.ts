import { gql } from "apollo-server";

export const SearchSchema = gql`
  type SearchResultWithPagination {
    users: [User_Logged]
    roles: [Role]
    jobs: [JobPostApplication]
    cohorts: [cohort]
    programs: [Program]
    trainees: [traineeApplicant]
    applicationCycles: [applicationCycle]
    totalUsers: Int
    totalRoles: Int
    totalJobs: Int
    totalCohorts: Int
    totalPrograms: Int
    totalTrainees: Int
    totalApplicationCycles: Int
    totalPages: SearchTotalPages
    currentPage: Int
  }

  type SearchTotalPages {
    users: Int
    roles: Int
    jobs: Int
    cohorts: Int
    programs: Int
    trainees: Int
    applicationCycles: Int
  }

  input SearchInput {
    page: Int
    itemsPerPage: Int
    searchTerm: String
    filterAttribute: String
  }

  type Query {
    searchData(input: SearchInput): SearchResultWithPagination
  }
`;