import { ticketModel } from "../models/ticketModel";
import { LoggedUserModel } from "../models/AuthUser";
import { CustomGraphQLError } from "../utils/customErrorHandler";
import { ApplicantNotificationsModel } from "../models/applicantNotifications";
import { RoleModel } from "../models/roleModel";
import { pusher } from "../helpers/pusher";
import { sendEmailTemplate } from "../helpers/bulkyMails";

export const ticketResolver = {
    Query: {
        getAllTickets: async (_: any, args: any, context: any) => {
            const userWithRole = await LoggedUserModel.findById(
                context.currentUser?._id
            ).populate("role");

            if (!userWithRole) {
                throw new CustomGraphQLError("User not found");
            }	

            if (
                !userWithRole ||
                ((userWithRole.role as any)?.roleName !== "admin" &&
                (userWithRole.role as any)?.roleName !== "superAdmin")
            ) {
                throw new CustomGraphQLError(
                    "You do not have permission to perform this action"
                );
            }
            try {
                const tickets = await ticketModel.find()
                .populate('author', 'email firstName lastName')
                .populate('adminResponse.respondedBy', 'email firstName lastName');
                if (tickets.length === 0) {
                    throw new CustomGraphQLError("No tickets found");
                }
                return tickets;
            } catch (error: any) {
                throw new CustomGraphQLError(error.message);
            }
        },
        getTicketById: async (_: any, { id }: any, context: any) => {
            try {
                const ticket = await ticketModel.findById(id);
                if (!ticket) {
                    throw new CustomGraphQLError("Ticket not found");
                }
                return ticket;
            } catch (error: any) {
                throw new CustomGraphQLError(error.message);
            }
        },

        getUserTickets: async (_: any, args: any, context: any) => {
            try{
                const tickets = await ticketModel.find({ author: context.currentUser?._id });
                if (tickets.length === 0) {
                  throw new CustomGraphQLError("No tickets found");
                }
                return tickets; 

            }catch (error: any) {
                throw new CustomGraphQLError(error.message);
            }
        }
    },
    Mutation: {
        createTicket: async(_: any, args: any, context: any) => {
            const user = await LoggedUserModel.findById(context.currentUser?._id);

            if (!user) {
                throw new CustomGraphQLError("User not found");
            }

            try{
                const newTicket = await ticketModel.create({
                    title: args.title,
                    body: args.body,
                    author: user._id,
                    status: "Open"
                });
                
                const message = `Your ticket "${args.title}" has been submitted successfully.`;
                const notification = await ApplicantNotificationsModel.create({
                    userId: user._id,
                    message,
                    eventType: "general",
                });

                await pusher
                    .trigger(`notifications-${user._id}`, "new-notification", {
                        message: notification.message,
                        id: notification._id,
                        createdAt: notification.createdAt,
                        read: notification.read,
                    })
                    .catch((error) => {
                        console.error("Error with Pusher trigger:", error);
                    });
                await sendEmailTemplate(
                    user.email,
                    "Ticket Received",
                    `Hello ${user.email.split("@")[0]}, `,
                    `Your Ticket titled:
                     <strong>${args.title}</strong>
                    has been received and will be reviewed soon.
                    <br />
                    <br />
                    Thank you for your patience.
              `
            );

                return newTicket.populate('author');
            } catch(error: any) {
                throw new CustomGraphQLError(error.message);
            }

        },
        updateTicket: async (_: any, { id, title, body, status }: any, context: any) => {
            try{
                const updatedTicket = await ticketModel.findByIdAndUpdate(
                    id,
                    { title, body, status: 'ApplicantReply'},
                    {new: true}
                );

                if(!updatedTicket){
                    throw new CustomGraphQLError("Ticket not found");
                }
                return updatedTicket;
            } catch(err: any){
                throw new CustomGraphQLError(err.message);
            }
        },

        resolveTicket: async(_: any, { id, adminResponse }: any, context: any) => {
            const userWithRole = await LoggedUserModel.findById(
                context.currentUser?._id
            ).populate("role");

            if (!userWithRole) {
                throw new CustomGraphQLError("User not found");
            }	

            if (
                !userWithRole ||
                ((userWithRole.role as any)?.roleName !== "admin" &&
                (userWithRole.role as any)?.roleName !== "superAdmin")
            ) {
                throw new CustomGraphQLError(
                    "You do not have permission to perform this action"
                );
            }
            try{
                const resolvedTicket = await ticketModel.findByIdAndUpdate(
                    id,
                    {status: "Resolved", 
                    adminResponse: {
                        body: adminResponse,
                        respondedBy: userWithRole._id
                    }},
                    {new: true}
                ).populate('adminResponse')
                if(!resolvedTicket){
                    throw new CustomGraphQLError("Ticket not found");
                }
                return resolvedTicket;

            } catch(err: any){
                throw new CustomGraphQLError(err.message);
            }
        }
    }
        
}
