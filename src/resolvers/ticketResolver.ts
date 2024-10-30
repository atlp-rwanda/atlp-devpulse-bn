import { ticketModel } from "../models/ticketModel";
import { LoggedUserModel } from "../models/AuthUser";
import { CustomGraphQLError } from "../utils/customErrorHandler";
import { ApplicantNotificationsModel } from "../models/applicantNotifications";
import { RoleModel } from "../models/roleModel";
import { pusher } from "../helpers/pusher";
import { sendEmailTemplate } from "../helpers/bulkyMails";
import { publishNotification } from "./adminNotificationsResolver";

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
                .populate('author', 'email firstname lastname')
                .populate('adminReplies.repliedBy', 'email firstname lastname')
                .populate('applicantReplies.repliedBy', 'email firstname lastname');
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
                const ticket = await ticketModel.findById(id)
                .populate('author')
                .populate('applicantReplies.repliedBy')
                .populate('adminReplies.repliedBy');;
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
                const tickets = await ticketModel.find({ author: context.currentUser?._id })
                .populate('author')
                .populate('applicantReplies.repliedBy')
                .populate('adminReplies.repliedBy');
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
                    status: "Open",
                    adminReplies: [],
                    applicantReplies: []
                });
                
                const message = `Your ticket "${args.title}" has been submitted successfully.`;
                const notification = await ApplicantNotificationsModel.create({
                    userId: user._id,
                    message,
                    eventType: "general",
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

                await publishNotification(
                    `${user!.firstname} ${user.lastname} has sent a new ticket.`,
                    "new_Ticket"
                );

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

                return newTicket.populate('author');
            } catch(error: any) {
                throw new CustomGraphQLError(error.message);
            }

        },
        updateTicket: async (_: any, { id, body }: any, context: any) => {
            const user = await LoggedUserModel.findById(context.currentUser?._id);

        if (!user) {
            throw new CustomGraphQLError("User not found");
        }

            try{

                const ticket = await ticketModel.findById(id);
            
            if (!ticket) {
                throw new CustomGraphQLError("Ticket not found");
            }
                const updatedTicket = await ticketModel.findByIdAndUpdate(
                    id,
{
                    status: 'ApplicantReply',
                    $push: {
                        applicantReplies: {
                            body,
                            repliedBy: user._id,
                            createdAt: new Date()
                        }
                    }
                },{new: true}
                ).populate('author')
                .populate('applicantReplies.repliedBy')
                .populate('adminReplies.repliedBy');

                if(!updatedTicket){
                    throw new CustomGraphQLError("Ticket not found");
                }

                await sendEmailTemplate(
                    user.email,
                    "Ticket Update",
                    `Hello ${user.email.split("@")[0]},`,
                    `Your ticket titled "<strong>${updatedTicket.title}</strong>" has been received.<br/>
                    <p>New response: ${body}</p>
                    <br/><br/>Thank you for your patience.<br/>`
                );

                const message = `Your ticket "${updatedTicket.title}" has been updated.`;
                const notification = await ApplicantNotificationsModel.create({
                    userId: updatedTicket.author._id,
                    message,
                    eventType: "general",
                });

                await publishNotification(
                    `${user!.firstname} ${user.lastname} has sent a new ticket.`,
                    "new_Ticket"
                );

                await pusher
                    .trigger(`notifications-${updatedTicket.author._id}`, "new-notification", {
                        message: notification.message,
                        id: notification._id,
                        createdAt: notification.createdAt,
                        read: notification.read,
                    })
                    .catch((error) => {
                        console.error("Error with Pusher trigger:", error);
                    });
                
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
                const user = await LoggedUserModel.findById(context.currentUser?._id);

                if (!user) {
                    throw new CustomGraphQLError("User not found");
                }
                const resolvedTicket = await ticketModel.findByIdAndUpdate(
                    id,
                    {status: "Resolved", 
                        $push: {
                            adminReplies: {
                                body: adminResponse,
                                repliedBy: user?._id,
                                createdAt: new Date()
                            }
                        }},
                    {new: true}
                )
                .populate('author')
                .populate('applicantReplies.repliedBy')
                .populate('adminReplies.repliedBy');
                if(!resolvedTicket){
                    throw new CustomGraphQLError("Ticket not found");
                }

                const message = `Your ticket "${resolvedTicket.title}" has been resolved.`;
                const notification = await ApplicantNotificationsModel.create({
                    userId: resolvedTicket.author._id,
                    message,
                    eventType: "general",
                });

                await pusher
                    .trigger(`notifications-${resolvedTicket.author._id}`, "new-notification", {
                        message: notification.message,
                        id: notification._id,
                        createdAt: notification.createdAt,
                        read: notification.read,
                    })
                    .catch((error) => {
                        console.error("Error with Pusher trigger:", error);
                    });

                if (user) {
                    await sendEmailTemplate(
                        user.email,
                        "Ticket Resolved",
                        `Hello ${user.email.split("@")[0]},`,
                        `Your ticket titled "<strong>${resolvedTicket.title}</strong>" has been resolved by our team. <br/>
                        <p>Response from Admin: ${adminResponse}</p>
                        <br/><br/>Thank you for your patience.<br/>`,
                    );
                }

                return resolvedTicket;

            } catch(err: any){
                throw new CustomGraphQLError(err.message);
            }
        }
    },
        
}
