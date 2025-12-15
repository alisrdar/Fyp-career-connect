import React from 'react';

type ProgressBarProps = {
  progress: number;
  stage: {
    name: string;
    color: string;
    textColor: string;
    icon: string;
  };
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, stage }) => {
  return (
    <div className="w-full space-y-2">
      {/* Stage Indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-semibold ${stage.textColor} flex items-center gap-2`}>
          <span className="text-xl">{stage.icon}</span>
          {stage.name}
        </span>
        <span className="text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${stage.color} transition-all duration-500 ease-out rounded-full shadow-md`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
