import { IStudent } from "./models/studentModel";
declare global {
    namespace Express {
      interface Request {
        student?: IStudent;
      }
    }
  }
