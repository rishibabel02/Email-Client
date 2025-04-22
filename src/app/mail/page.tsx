'use client'

import React from 'react'
// import Mail from './mail'
import dynamic from 'next/dynamic'
import ThemeToggle from '@/components/theme-toggle'

const Mail = dynamic(() =>{
  return import('./mail')
},{
  ssr : false  //setting the server side rendering to false because we are using the client side components
})
const MailDashboard = () => {
  return (
    <>
    <div className="absolute bottom-4 left-4">
      <ThemeToggle/>
    </div>
      <Mail
      defaultLayout={[20, 32, 48]}
      navCollapsedSize={4}
      defaultCollapsed={false}
      />
    </>
  )
}

export default MailDashboard