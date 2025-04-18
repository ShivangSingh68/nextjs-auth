import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtVerify } from "jose";

export async function getDataFromToken(token: any) {
  const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
  const decodedUser = await jwtVerify(token, secret);
  return decodedUser.payload;
}
