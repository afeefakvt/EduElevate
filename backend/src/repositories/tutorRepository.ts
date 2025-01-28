import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import Tutor, { ITutor } from "../models/tutorModel";

export class TutorRepository implements ITutorRepository{
    async registerTutor(tutorData: ITutor): Promise<ITutor> {
        const tutor = new Tutor(tutorData) 
        return await tutor.save()
    }
    async findTutorByEmail(email: string): Promise<ITutor | null> {
        return await Tutor.findOne({email})
    }

}