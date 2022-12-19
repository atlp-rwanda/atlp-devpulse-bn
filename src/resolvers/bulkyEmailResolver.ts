import sendEmail from "../helpers/bulkyMails";


const sendBulkyEmailResolver = {
  Query: {
    async sendBulkyEmail(_: any,  params: any) {
        return sendEmail(params)
    },
  },
};

export default sendBulkyEmailResolver;
