import { ticketModel } from "../models/ticketModel";
import { LoggedUserModel } from "../models/AuthUser";
import { CustomGraphQLError } from "../utils/customErrorHandler";

const filterTicketResolver = {
    Query: {
        async filterTicketDetails(_: any, { input }: any) {
            const { page, itemsPerPage, All, wordEntered, filterAttribute } = input;
            let pages = page || 1;
            let items = All ? await ticketModel.countDocuments({}) : (itemsPerPage || 10);
      
            const itemsToSkip = (pages - 1) * items;
      
            let query: any = {};
      
            if (wordEntered && filterAttribute) {
              const allowedAttributes = [
                'title', 'status', 'author', 'lastUpdate'
              ];
      
              if (allowedAttributes.includes(filterAttribute)) {
                query[filterAttribute] = { $regex: wordEntered, $options: 'i' };
              }
            }
      
            try {
              const allTickets = await ticketModel.find(query)
              .populate('author')
              .populate('applicantReplies.repliedBy')
              .populate('adminReplies.repliedBy')
              .skip(itemsToSkip)
              .limit(items);
      
              return allTickets;
            } catch (error) {
              console.error("Error filtering tickets:", error);
              return [];
            }
          },

          async getAllTicketAttributescount() {
            const AllTicketAttributescount = await ticketModel.countDocuments();
            return { total: AllTicketAttributescount };
          },
    }
}

export default filterTicketResolver;