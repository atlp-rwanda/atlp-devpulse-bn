import { OAuth2Client } from "google-auth-library";
import { LoggedUserModel } from "../../models/AuthUser";
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

export const findOrCreateUser = async (token: any) => {
  //verify token
  const googleUser = await verifyAuthToken(token);
  //check existance of user
  const user = await checkIfUserExists(googleUser?.email);

  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async (token: any) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    return ticket.getPayload();
  } catch (error) {
    console.error("Error verifying token", error);
  }
};

const checkIfUserExists = async (email: any) =>
  await LoggedUserModel.findOne({ email }).exec();

const createNewUser = async (googleUser: any) => {
  const { name, email,role, picture} = googleUser;
  const user = { name, email, picture,role, createdAt: new Date().toISOString() };
  return new LoggedUserModel(user).save();
};
