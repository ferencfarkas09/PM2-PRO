import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navigation component for the application
 * @param {Object} props - Component props
 * @param {string} props.activePage - The currently active page
 * @param {Function} props.onNavigate - Function to call when a navigation item is clicked
 * @param {boolean} props.menuOpen - Whether the mobile menu is open
 * @returns {JSX.Element} The navigation component
 */
const Navigator = ({ activePage, onNavigate, menuOpen }) => {
  return (
    <nav className={`main-nav ${menuOpen ? 'active' : ''}`}>
      <ul>
        <li>
          <Link 
            to="/dashboard" 
            className={activePage === 'dashboard' ? 'active' : ''} 
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/metrics" 
            className={activePage === 'metrics' ? 'active' : ''} 
            onClick={() => onNavigate('metrics')}
          >
            Metrics
          </Link>
        </li>
        <li>
          <Link 
            to="/logs" 
            className={activePage === 'logs' ? 'active' : ''} 
            onClick={() => onNavigate('logs')}
          >
            Logs
          </Link>
        </li>
        <li>
          <Link 
            to="/settings" 
            className={activePage === 'settings' ? 'active' : ''} 
            onClick={() => onNavigate('settings')}
          >
            Settings
          </Link>
        </li>
        <li>
          <Link 
            to="/help" 
            className={activePage === 'help' ? 'active' : ''} 
            onClick={() => onNavigate('help')}
          >
            Help
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigator;
