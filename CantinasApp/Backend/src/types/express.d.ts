declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      role: string;
    };
    requestId?: string;
    }
  }


export {};
