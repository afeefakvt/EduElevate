import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";

export class EnrollmentController {
    constructor(
        private enrollmentService:IEnrollmentService
    ){}
}