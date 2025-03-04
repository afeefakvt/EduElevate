export interface ITutor{
    _id:string;
    name:string;
    email:string;
    status:string;
    isBlocked:boolean;
    isApproved:boolean;
    bio:string;
    title:string;
    courseId?:{
        title:string;
        tutorId:{
            _id:string;
            name:string
        }
    };
    createdAt:string;
} 