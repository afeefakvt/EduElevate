import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { IStudent } from "../models/studentModel";
import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import { ITutor } from "../models/tutorModel";


export const login  = async(email:string,password:string,repository:IStudentRepository):Promise<{token:string,student:IStudent}>=>{
    if(!email ||!password){
        throw new Error('Email and Password cannot be empty')
    }

    const student = await repository.findStudentByEmail(email)
    if(!student){
        throw new Error('Email cannot found')
    }

    const isValidPassword = await comparePassword(password,student.password)
    if(!isValidPassword){
        throw new Error('invalid password')
    }

    const token = generateToken({id:student._id,email:student.email,isBlocked:student.isBlocked,role:student.role});
    return {token,student}
}

export const tutorLogin  = async(email:string,password:string,repository:ITutorRepository):Promise<{token:string,tutor:ITutor}>=>{
    if(!email ||!password){
        throw new Error('Email and Password cannot be empty')
    }

    const tutor = await repository.findTutorByEmail(email)
    if(!tutor){
        throw new Error('Email cannot found')
    }

    const isValidPassword = await comparePassword(password,tutor.password)
    if(!isValidPassword){
        throw new Error('invalid password')
    }
    if (!tutor.isApproved) {
        throw new Error('You cannot login. Your account is waiting admin approval')
      }
      if (tutor.status==='rejected') {
        throw new Error('Your cannot login. Your approval is rejected by admin')
      }

    const token = generateToken({id:tutor._id,email:tutor.email,isBlocked:tutor.isBlocked,isApproved:tutor.isApproved,status:tutor.status,title:tutor.title,bio:tutor.bio,});
    return {token,tutor}
}