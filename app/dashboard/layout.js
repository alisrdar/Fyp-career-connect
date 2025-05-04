import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar Section */}
      <aside style={{ width: '250px', background: '#333', color: '#fff', padding: '20px' }}>
        <h2 style={{ color: '#fff', textAlign: 'center' }}>Career Connect</h2>
        <nav style={{ marginTop: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <a href="#overview" style={{ textDecoration: 'none', color: '#fff' }}>Overview</a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#stats" style={{ textDecoration: 'none', color: '#fff' }}>Statistics</a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#settings" style={{ textDecoration: 'none', color: '#fff' }}>Settings</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Section */}
      <main style={{ flex: 1, padding: '20px', background: '#f9f9f9' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;