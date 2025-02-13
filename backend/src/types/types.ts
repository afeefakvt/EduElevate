import { Request } from "express";

export interface AuthenticatedRequest extends Request{
    student:{id:string}
}