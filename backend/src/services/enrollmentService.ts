import { IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";

export class EnrollmentService implements IEnrollmentService{
    private enrollmentRepository:IEnrollmentRepository

    constructor(enrollmentRepository:IEnrollmentRepository){
        this.enrollmentRepository = enrollmentRepository
    }
}