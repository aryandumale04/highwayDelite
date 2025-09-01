import jwt, { SignOptions } from "jsonwebtoken";

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRE;

  if (!secret) throw new Error("JWT_SECRET not defined in env");
  if (!expire) throw new Error("JWT_EXPIRE not defined in env");

  const options: SignOptions = { expiresIn: expire as any }; // bypass TS strict type issue

  return jwt.sign({ id: userId }, secret, options);
};

export default generateToken;
