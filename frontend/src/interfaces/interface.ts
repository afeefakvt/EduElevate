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
    isBlocked:boolean;
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

export interface Lecture {
    order: number;
    _id: string;
    title: string;
    videoUrl: string;
    description: string;
    duration: string;
    isListed: boolean;

  
  }
export interface Course {
    _id: string;
    title: string;
    tutorId: {_id:string; name:string}
    categoryId: {_id:string; name:string}
    price: number;
    totalRatings: number;
    studentsEnrolled: number;
    status:string;
    categoryName:string,
    thumbnail:string,
    isRequestedToEdit:Boolean,
    duration:string,
    isApproved:boolean,
    isListed:boolean,
    level:string,
    description:string,
    lectures:Lecture[],
    rejectReason:string

  }
 
  export interface Category {
    _id: string;
    name: string;
    isListed: boolean;
  }

 export interface Enrollment {
    _id: string;
    courseId: Course;
    studentId: string;
    paymentStatus: string;
    paymentAmount: string;
  }

  export interface SalesEntry{
    date:string,
    totalRevenue:number
  }

 export interface ProfileProps {
    userType: "student" | "tutor";
}

export interface Payment{
    _id:string,
    tutorId:{
        name:string
    },
    courseId:{
        title:string,
        price:number
    },
    newEnrollments:number,
    settlementPrice:number,
    updatedAt:string,
    settlementDate:string
    settlementStatus:string
}