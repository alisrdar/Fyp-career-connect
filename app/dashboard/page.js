import React from 'react';

const Home = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Header Section */}
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <p>Welcome to Career Connect Dashboard</p>
      </header>

      {/* Navigation Section */}
      <nav style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-around', background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
        <a href="#overview" style={{ textDecoration: 'none', color: '#333' }}>Overview</a>
        <a href="#stats" style={{ textDecoration: 'none', color: '#333' }}>Statistics</a>
        <a href="#settings" style={{ textDecoration: 'none', color: '#333' }}>Settings</a>
      </nav>

      {/* Main Content Section */}
      <main>
        <section id="overview" style={{ marginBottom: '20px' }}>
          <h2>Overview</h2>
          <p>Here is a quick overview of your application.</p>
        </section>

        <section id="stats" style={{ marginBottom: '20px' }}>
          <h2>Statistics</h2>
          <p>Display some key metrics and charts here.</p>
        </section>

        <section id="settings">
          <h2>Settings</h2>
          <p>Manage your preferences and account settings here.</p>
        </section>
      </main>

      {/* Footer Section */}
      <footer style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9em', color: '#666' }}>
        <p>&copy; 2025 Career Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;