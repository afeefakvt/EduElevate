import  {IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import Enrollment,{IEnrollment} from "../models/enrollmentModel";
import { BaseRepository } from "./baseRepository";

export class EnrollmentRepository extends BaseRepository<IEnrollment> implements IEnrollmentRepository{
    constructor(){
        super(Enrollment)
    }
}