import React from 'react';

const Mission = ({ heading, text }) => (
  <section id="mission" className="max-w-4xl mx-auto px-6 py-12 text-center">
    <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
      {heading}
    </h2>
    <p className="text-lg text-gray-700 dark:text-gray-300">
      {text}
    </p>
  </section>
);
export default Mission