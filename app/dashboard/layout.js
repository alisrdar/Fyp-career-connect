import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      

      {/* Main Content Section */}
              {children}
      
    </div>
  );
};

export default DashboardLayout;