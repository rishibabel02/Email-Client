import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex justify-center items-center h-screen w-full top-50 flex-col'>
      <SignIn />
    </div>
  ) 
}