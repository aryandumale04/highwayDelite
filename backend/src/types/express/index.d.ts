import { UserDocument } from "../../models/User"; // we will update User model type soon
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // this will allow req.user in auth middleware
    }
  }
}
