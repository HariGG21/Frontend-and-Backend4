// src/express.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

interface UserPayload {
  id: number;
  username: string;
  // Add other user properties as needed
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Use the specific UserPayload type
    }
  }
}






