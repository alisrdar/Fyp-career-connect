import React from 'react';
import Step from './About/Step';

const defaultSteps = [
  {
    title: 'Self-Discovery Survey',
    description:
      'Complete a brief IPIP-based questionnaire plus custom interest questions to help us understand your personality and preferences.',
  },
  {
    title: 'Adaptive Quiz Assessment',
    description:
      'Take our IRT-driven quiz that adapts in real-time to your performance for a precise skill evaluation.',
  },
  {
    title: 'AI-Powered Recommendations',
    description:
      'Receive personalized career path and learning resource recommendations based on your survey and quiz results.',
  },
];

const HowItWorks = ({ steps = defaultSteps }) => (
  <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-12">
    <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
      How It Works
    </h2>
    <div className="space-y-12">
      {steps.map((s, idx) => (
        <Step key={idx} step={idx + 1} title={s.title} description={s.description} />
      ))}
    </div>
  </section>
);
export default HowItWorks