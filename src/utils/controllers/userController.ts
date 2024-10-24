import { OAuth2Client } from 'google-auth-library';
import { LoggedUserModel } from '../../models/AuthUser';
import { RoleModel } from '../../models/roleModel';
import { verifyToken } from '../generateToken';
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

export const findOrCreateUser = async (token: any) => {
  let user = null;
  const payload = verifyToken(token);
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    if (payload.data.source === 'dev-pulse') {
      user = await LoggedUserModel.findById({ _id: payload.data.userId });
      return user;
    }
  }
  const googleUser = await verifyAuthToken(token);
  user = await checkIfUserExists(googleUser?.email);

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
    console.error('Error verifying token', error);
  }
};

const checkIfUserExists = async (email: any) =>
  await LoggedUserModel.findOne({ email }).exec();

const createNewUser = async (googleUser: any) => {
  const { given_name, family_name, email, picture } = googleUser;
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL;
  const applicantRole = await RoleModel.findOne({ roleName: 'applicant' });
  const superAdminRole = await RoleModel.findOne({ roleName: 'superAdmin' });
  const adminRole = await RoleModel.findOne({ roleName: 'admin' });

  const createSuperAdminRole = async () => {
    const newSuperAdminRole = new RoleModel({
      roleName: 'superAdmin',
      description: 'Super Admin Role Description',
    });
    const savedSuperAdminRole = await newSuperAdminRole.save();
    return savedSuperAdminRole._id;
  };

  const createAdminRole = async () => {
    const newAdminRole = new RoleModel({
      roleName: 'admin',
      description: 'Admin Role Description',
    });
    const savedAdminRole = await newAdminRole.save();
    return savedAdminRole._id;
  }

  const createApplicantRole = async () => {
    const newApplicantRole = new RoleModel({
      roleName: 'applicant',
      description: 'Applicant Role Description',
    });
    const savedApplicantRole = await newApplicantRole.save();
    return savedApplicantRole._id;
  };

  const roleId =
    email === superAdminEmail
      ? superAdminRole?._id || createSuperAdminRole()
      : email === adminEmail
      ? adminRole?._id || createAdminRole()
      : applicantRole?._id || createApplicantRole();

  // Fallback values for fields missing in Google data
  const user = {
    firstname: given_name,
    lastname: family_name,
    email,
    picture: picture || process.env.DEFAULT_AVATAR,  
    role: roleId,
    code: '+250', 
    password: 'GOOGLE_SIGN_IN',  
    country: '',           
    telephone: '',                
    gender: 'other',
    authMethod: 'google',            
    isActive: true,
    isVerified: false,
    isEmailVerified: true,        
    createdAt: new Date().toISOString(),
  };

  const newUser = await new LoggedUserModel(user).save();
  const userWithRole = await LoggedUserModel.findById(newUser._id).populate(
    'role',
  );
  return userWithRole;
};
