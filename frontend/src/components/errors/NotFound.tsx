import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notFound from '../../assets/Free Vector _ Oops! 404 error with a broken robot concept illustration.jpg'


const NotFound:React.FC = () => {
    const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
<div className='max-w-md w-full text-center'>
<div className='space-y-6 '>
<div className='relative'>  
<div className='absolute inset-0 flex items-center justify-center'>
<img src={notFound} alt="Page not found" className='w-50 h-50 object-cover ' />
</div>
</div>
</div>
</div>
<div className='space-y-4'>
    <h2 className='text-3xl font-bold text-gray-900 text-center'>Page Not Found</h2>
    <p className='text-gray-600 '> Oops! The page your're looking for seems to have wandered off. Let's get you back on track.</p>
<div className='flex  flex-col sm:flex-row gap-4 justify-center'>
<button
onClick={()=>navigate(-1)}
 className='inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg text-base font-bold text-[#000000]bg-[#ffffff] hover:bg-[#550A8A] hover:text-white  transition-colors duration-200  hover:border-transparent border-dashed'
>
  <ArrowLeft className='w-5 h-5 mr-2  '/>
    Go Back
</button>

</div>
</div>
    </div>
  )
}

export default NotFound