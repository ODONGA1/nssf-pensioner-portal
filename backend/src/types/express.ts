import { Request } from "express";

// Extend Express Request interface for authenticated requests
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    pensionerId?: string;
    sessionId?: string;
  };
}

// Request with ID for logging
export interface RequestWithId extends Request {
  id: string;
}
