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

export interface MyTutor{
    tutor:ITutor;
    courseId:{
        tutorId:{
            _id:string
        }
    }
}

export interface IMessage{
    _id:string;
    senderId:string;
    recipientId:string;
    message:string;
    read:boolean;
    readAt?: string | null;
    timestamp?:string;
    fileUrl?:string | null;
    fileType?:string | null
}

export interface IStudent{
    _id:string;
    name:string;
    email:string;
    isBlocked:Boolean;
    createdAt:string
}
export interface MyStudent{
    student:IStudent    
}
export interface NotificationProps{
    open:boolean;
    message:string;
    onClose:()=>void;
    onClick:()=>void;
}
