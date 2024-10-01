import { gql } from "apollo-server";

export const SearchSchema = gql`
  type SearchResultWithPagination {
    users: [User_Logged]
    roles: [Role]
    jobs: [JobPostApplication]
    cohorts: [cohort]
    programs: [Program]
    totalUsers: Int
    totalPages: Int
    currentPage: Int
  }

  input SearchInput {
    page: Int
    itemsPerPage: Int
    All: Boolean
    searchTerm: String
    filterAttribute: String
  }

  type Query {
    searchData(input: SearchInput): SearchResultWithPagination
  }
`;