declare module "express-slow-down" {
  import { Request, Response, NextFunction } from "express";

  interface SlowDownOptions {
    windowMs?: number;
    delayAfter?: number;
    delayMs?: number;
    maxDelayMs?: number;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    onLimitReached?: (
      req: Request,
      res: Response,
      options: SlowDownOptions
    ) => void;
    keyGenerator?: (req: Request) => string;
    skip?: (req: Request, res: Response) => boolean;
  }

  function slowDown(
    options?: SlowDownOptions
  ): (req: Request, res: Response, next: NextFunction) => void;

  export = slowDown;
}
