import sendBulkyEmail from "../helpers/bulkyMails";


const sendBulkyEmailResolver = {
  Query: {
    async sendBulkyEmail(_: any,  params: any) {
        return sendBulkyEmail(params)
    },
  },
};

export default sendBulkyEmailResolver;
