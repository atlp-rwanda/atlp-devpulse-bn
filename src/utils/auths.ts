import 'dotenv/config';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SECRET

export interface AuthTokenPayload{
    userId:String,
    firstName:String,
    lastName:String
    email:String
}

export const decodeToken = (authHeader:String):AuthTokenPayload =>{
    const token = authHeader.replace("Bearer","");

    if(!token){
        throw new Error("You must login first!");
    }
    const decodedToken = jwt.verify(token, JWT_SECRET||"");
    
    return decodedToken as AuthTokenPayload
    
}