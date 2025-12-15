'use client';

import { motion } from 'framer-motion';

interface PersonalityAlignment {
  analytical: number;
  creative: number;
  social: number;
  independent: number;
  structured: number;
  flexible: number;
}

interface SkillRadarProps {
  alignment: PersonalityAlignment;
}

export default function SkillRadar({ alignment }: SkillRadarProps) {
  const traits = [
    { key: 'analytical', label: 'Analytical', value: alignment.analytical, color: 'bg-blue-500' },
    { key: 'creative', label: 'Creative', value: alignment.creative, color: 'bg-purple-500' },
    { key: 'social', label: 'Social', value: alignment.social, color: 'bg-pink-500' },
    { key: 'independent', label: 'Independent', value: alignment.independent, color: 'bg-green-500' },
    { key: 'structured', label: 'Structured', value: alignment.structured, color: 'bg-orange-500' },
    { key: 'flexible', label: 'Flexible', value: alignment.flexible, color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Personality Alignment
      </h3>

      <div className="space-y-4">
        {traits.map((trait, idx) => {
          const percentage = Math.round(trait.value * 100);
          
          return (
            <div key={trait.key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {trait.label}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {percentage}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ 
                    delay: 0.9 + idx * 0.1, 
                    duration: 0.8, 
                    ease: 'easeOut' 
                  }}
                  className={`absolute top-0 left-0 h-full ${trait.color} rounded-full`}
                >
                  {/* Shine effect */}
                  <motion.div
                    animate={{
                      x: [-100, 200],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: 'linear',
                      delay: idx * 0.2,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{ width: '100px' }}
                  />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Radar Chart (CSS-based) */}
      <div className="mt-8 relative w-full aspect-square max-w-[280px] mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background hexagon grid */}
          <polygon
            points="100,20 173,60 173,140 100,180 27,140 27,60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-300 dark:text-gray-600"
            opacity="0.3"
          />
          <polygon
            points="100,50 153,75 153,125 100,150 47,125 47,75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-300 dark:text-gray-600"
            opacity="0.3"
          />
          <polygon
            points="100,80 133,90 133,110 100,120 67,110 67,90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-300 dark:text-gray-600"
            opacity="0.3"
          />

          {/* Axes */}
          {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const x2 = 100 + 80 * Math.cos(rad);
            const y2 = 100 + 80 * Math.sin(rad);
            return (
              <line
                key={idx}
                x1="100"
                y1="100"
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-300 dark:text-gray-600"
                opacity="0.3"
              />
            );
          })}

          {/* Data polygon */}
          <motion.polygon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            points={[
              [100, 20, traits[0].value],  // top (analytical)
              [173, 60, traits[1].value],  // top-right (creative)
              [173, 140, traits[2].value], // bottom-right (social)
              [100, 180, traits[3].value], // bottom (independent)
              [27, 140, traits[4].value],  // bottom-left (structured)
              [27, 60, traits[5].value],   // top-left (flexible)
            ]
              .map(([x, y, value]) => {
                const centerX = 100;
                const centerY = 100;
                const scale = value;
                const scaledX = centerX + (x - centerX) * scale;
                const scaledY = centerY + (y - centerY) * scale;
                return `${scaledX},${scaledY}`;
              })
              .join(' ')}
            fill="url(#radarGradient)"
            stroke="#10B981"
            strokeWidth="2"
            opacity="0.7"
          />

          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Labels */}
          <text x="100" y="15" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
            Analytical
          </text>
          <text x="178" y="65" textAnchor="start" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
            Creative
          </text>
          <text x="178" y="145" textAnchor="start" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
            Social
          </text>
          <text x="100" y="195" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
            Independent
          </text>
          <text x="22" y="145" textAnchor="end" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
            Structured
          </text>
          <text x="22" y="65" textAnchor="end" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
            Flexible
          </text>
        </svg>
      </div>
    </div>
  );
}
