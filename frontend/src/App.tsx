import { useState } from 'react';
import DashboardView from './components/DashboardView';
import DoctorView from './components/DoctorView';
import WaitingRoomView from './components/WaitingRoomView';
import './App.css';

const TENANT_ID = '123e4567-e89b-12d3-a456-426614174000';
const QUEUE_ID = '123e4567-e89b-12d3-a456-426614174001';

type ViewMode = 'all' | 'dashboard' | 'doctor' | 'waiting';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">+</div>
            <div>
              <h1>MedQueue</h1>
              <p className="header-subtitle">Patient Management System</p>
            </div>
          </div>
          <div className="header-info">
            <div className="info-item">
              <span className="label">Clinic:</span> {TENANT_ID.slice(0, 8)}...
            </div>
            <div className="info-item">
              <span className="label">Queue:</span> {QUEUE_ID.slice(0, 8)}...
            </div>
          </div>
        </div>
      </header>

      <nav className="tabs">
        <button 
          className={`tab ${viewMode === 'all' ? 'active' : ''}`}
          onClick={() => setViewMode('all')}
        >
          Overview
        </button>
        <button 
          className={`tab ${viewMode === 'dashboard' ? 'active' : ''}`}
          onClick={() => setViewMode('dashboard')}
        >
          Clinic Dashboard
        </button>
        <button 
          className={`tab ${viewMode === 'doctor' ? 'active' : ''}`}
          onClick={() => setViewMode('doctor')}
        >
          Physician Station
        </button>
        <button 
          className={`tab ${viewMode === 'waiting' ? 'active' : ''}`}
          onClick={() => setViewMode('waiting')}
        >
          Waiting Area
        </button>
      </nav>

      <main className="content">
        {viewMode === 'all' && (
          <div className="views-container">
            <div className="view-panel">
              <h2>Clinic Dashboard</h2>
              <DashboardView tenantId={TENANT_ID} queueId={QUEUE_ID} />
            </div>
            
            <div className="view-panel">
              <h2>Physician Station</h2>
              <DoctorView tenantId={TENANT_ID} queueId={QUEUE_ID} />
            </div>
            
            <div className="view-panel">
              <h2>Waiting Area</h2>
              <WaitingRoomView tenantId={TENANT_ID} queueId={QUEUE_ID} />
            </div>
          </div>
        )}

        {viewMode === 'dashboard' && (
          <div className="single-view">
            <div className="view-panel">
              <h2>Clinic Dashboard</h2>
              <DashboardView tenantId={TENANT_ID} queueId={QUEUE_ID} />
            </div>
          </div>
        )}

        {viewMode === 'doctor' && (
          <div className="single-view">
            <div className="view-panel">
              <h2>Physician Station</h2>
              <DoctorView tenantId={TENANT_ID} queueId={QUEUE_ID} />
            </div>
          </div>
        )}

        {viewMode === 'waiting' && (
          <div className="single-view">
            <div className="view-panel">
              <h2>Waiting Area</h2>
              <WaitingRoomView tenantId={TENANT_ID} queueId={QUEUE_ID} />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Developer</h3>
            <p>Vinicius</p>
            <p>Full-Stack Developer | Clean Architecture</p>
          </div>
          <div className="footer-section">
            <p><strong>Email:</strong> <a href="mailto:your.email@example.com">your.email@example.com</a></p>
            <p><strong>GitHub:</strong> <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">github.com/yourprofile</a></p>
            <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">linkedin.com/in/yourprofile</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
