import Jwt from 'jsonwebtoken';

const generateToken = (data: any, options: any) => {
  const token = Jwt.sign({ data }, process.env.JWT_SECRET as string, options);
  return token;
};
const verifyToken = (token: any) => {
  try {
    const obj = Jwt.verify(token, process.env.JWT_SECRET as string);
    return obj;
  } catch (error) {
    console.error("OOps! Error verifying token :", error)
    return null;
  }
};
export { generateToken, verifyToken };
