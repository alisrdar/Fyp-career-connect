import React from 'react'
import Image from 'next/image'

const PromoContent = ({className, imgageSrc, points =[{
    heading :"Lorem",
    description: "Lorem epsum"
}]  }) => {
    const baseStyles = "flex gap-4 px-4 py-8 my-2 w-full "
  return (
    <div className={`${baseStyles} ${className} bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark `}>
      {/* content */}
        <div className="">
            { points.map((p) => (
              <div key={p.heading}>
                <h2>{p.heading}</h2>
                <h3>{p.description}</h3>
              </div>
            )
            )}
        </div>
      {/* Image */}
      <div className="">
        <Image
            src={imgageSrc}
            width={500}
            height={300}
            fill
            alt='Card Image'
            className="w-full h-48 object-cover block"
        />
      </div>
    </div>
  )
}

export default PromoContent
