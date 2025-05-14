import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{  minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {children}
    </div>
  );
};

export default DashboardLayout;