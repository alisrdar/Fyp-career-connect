import React from 'react';

const WhyItWorks = ({ heading = 'Why It Works', points }) => (
  <section id="why-it-works" className="max-w-4xl mx-auto px-6 py-12">
    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
      {heading}
    </h2>
    <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
      {points.map((pt, idx) => (
        <li key={idx}>{pt}</li>
      ))}
    </ul>
  </section>
);

export default WhyItWorks