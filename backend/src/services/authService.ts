import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { IStudent } from "../models/studentModel";


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