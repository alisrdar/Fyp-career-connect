// components/About/Step.jsx
import React from 'react';
import StepIcon from './StepIcon';
const Step = ({ step, title, description }) => (
  <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-x-6">
    <StepIcon step={step} />
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </div>
  </div>
);
export default Step