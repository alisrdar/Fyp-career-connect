// components/About/Team.jsx
import React from 'react';
import Card from './ui/Card';  // adjust path as needed

const Team = ({ members }) => (
  <section id="team" className="max-w-6xl mx-auto px-6 py-12">
    <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
      Meet the Team
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((m, idx) => (
        <Card
          key={idx}
          imageSrc={m.avatarUrl}
          title={m.name}
          description={m.role}
          linkText={m.linkText || ''}
          href={m.linkHref || ''}
          className="h-full"
        />
      ))}
    </div>
  </section>
);

export default Team