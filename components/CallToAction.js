import React from 'react'
import Image from 'next/image'
import Button from './ui/Button'
import { useRouter } from 'next/router'

const CallToAction = ({imgSrc, title, description, style="headings",onClick, orientation="flex-row", hasLists= false, listItems= []}) => {

    const router = useRouter();

    const handleLearnClick = () => {
      router.push('/resources');
    }
    const handleSignClick = () => {
      router.push('sign-up');
    }
    
  return (
    <section className={`flex ${orientation} gap-6`}>
        {/* Content */}
        <div className='flex w-full md:w-1/2'>
            { title && (
                <h2 className=' text-foreground-light font-bold mb-2 dark:text-foreground-dark text-4xl'>{title}</h2>
            )}
            <p className='font-bold text-md '>
                {description}
            </p>
            {/* Conditionally rendering lists, if present */}
            {(hasLists)? (
                <ul className='list-none pl-5'>
                    {
                        listItems.map((item, index) => (
                        <li key={index}>{item}</li>
                        ))
                    }
                </ul>
            ):
            (   
                <div>
                    <Button
                        variant='primary'
                        onClick={handleLearnClick}
                        btnText={"Learn More"}
                    />   
                    <Button
                        variant='ghost'
                        onClick={handleSignClick}
                        btnText={"Sign-Up"}
                    />
                </div>
            )}
        </div>

        {/* About-Image */}
        <div className='w-full md:w-1/2'>
            {imgSrc && (
            <Image
                src={imgSrc}
                alt={title || "Card Image"}
                width={500}
                height={500}
                className="w-full object-cover block"
            >
            </Image>
            )}
        </div>
    </section>
  )
}

export default CallToAction
