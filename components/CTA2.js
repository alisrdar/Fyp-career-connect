"use client"
import React from 'react';
import Image from 'next/image';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';

 const CallToAction = ({
  imgSrc,
  title,
  description,
  style = 'headings',
  orientation = 'flex-row',
  hasLists = false,
  listItems = [],
}) => {
  const router = useRouter();

  const handleLearnClick = () => router.push('/resources');
  const handleSignClick = () => router.push('/sign-up');

  return (
    <section className={`flex ${orientation} gap-6 max-w-5xl mx-auto px-6 py-12`}>
      <div className="flex w-full md:w-1/2 flex-col space-y-4">
        {title && (
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        <p className="text-gray-700 dark:text-gray-300">
          {description}
        </p>

        {hasLists ? (
          <ul className="list-disc list-inside space-y-2">
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <div className="flex gap-4">
            <Button variant="primary" onClick={handleLearnClick} btnText="Learn More" />
            <Button variant="ghost" onClick={handleSignClick} btnText="Sign Up" />
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2">
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={title || 'Call to Action Image'}
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-md"
            priority
          />
        )}
      </div>
    </section>
  );
};
export default CallToAction