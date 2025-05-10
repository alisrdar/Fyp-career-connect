import React from 'react'
import { LucideDock } from 'lucide-react'

const DashboardCard = ({
    title,
    description,
    btn1Text,
    btn2Text,

}) => {
  return (
    <div >
        {/* Icon */}
      <div>
        <LucideDock className='w-10 h-10 text-primary' />
      </div>
      {/*  */}
    </div>
  )
}

export default DashboardCard
