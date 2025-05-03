import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './App.scss';

// Import components
import Navigator from './components/Navigator';
import Dashboard from './pages/Dashboard';
import Metrics from './pages/Metrics';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Help from './pages/Help';
import {appConfig} from "./config";

const socket = io(appConfig.API_URL);

/**
 * Main application component for the PM2 Dashboard
 * Manages process data, user authentication, and routing
 * @returns {JSX.Element} The rendered application
 */
function App() {
  const [processes, setProcesses] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState('');
  const [selected, setSelected] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  /**
   * Fetches the latest process data from the API
   * @returns {void}
   */
  const refreshProcesses = () => {
    axios.get(appConfig.API_URL+'/api/processes').then(res => setProcesses(res.data));
  };

  // Check for stored credentials on component mount
  useEffect(() => {
    const storedCredentials = localStorage.getItem('pm2_credentials');
    if (storedCredentials) {
      const { username: storedUsername, timestamp } = JSON.parse(storedCredentials);
      const expirationTime = 30 * 60 * 1000; // 30 minutes in milliseconds
      const currentTime = new Date().getTime();

      // Check if credentials are still valid (within 30 minutes)
      if (currentTime - timestamp < expirationTime) {
        setUsername(storedUsername);
        setIsLoggedIn(true);
      } else {
        // Clear expired credentials
        localStorage.removeItem('pm2_credentials');
      }
    }
  }, []);

  useEffect(() => {
    refreshProcesses();
    socket.on('metrics', (data) => setMetrics(data));
  }, []);

  /**
   * Controls a PM2 process (start, stop, restart)
   * @param {string} action - The action to perform (start, stop, restart)
   * @param {string} name - The name of the process to control
   * @returns {void}
   */
  const control = (action, name) => {
    axios.post(appConfig.API_URL+`/api/process/${action}`, { name }).then(refreshProcesses);
  };

  /**
   * Loads logs for a specific process
   * @param {string} name - The name of the process to load logs for
   * @returns {void}
   */
  const loadLogs = (name) => {
    setSelected(name);
    axios.get(appConfig.API_URL+`/api/process/logs/${name}`).then(res => setLogs(res.data));
  };

  /**
   * Groups processes by name prefix (assuming cluster processes have similar names)
   * @returns {Object} An object with group names as keys and arrays of processes as values
   */
  const groupProcesses = () => {
    const groups = {};
    processes.forEach(proc => {
      // Extract group name (everything before the first dash or the full name if no dash)
      const groupName = proc.name.split('-')[0];
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(proc);
    });
    return groups;
  };

  /**
   * Toggles the expansion state of a process group
   * @param {string} groupName - The name of the group to toggle
   * @returns {void}
   */
  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  /**
   * Handles a process action by showing a confirmation modal
   * @param {string} action - The action to perform (start, stop, restart)
   * @param {string} name - The name of the process to act on
   * @returns {void}
   */
  const handleAction = (action, name) => {
    setConfirmAction({ action, name });
    setShowModal(true);
  };

  /**
   * Confirms and executes a process action
   * @returns {void}
   */
  const confirmActionHandler = () => {
    if (confirmAction) {
      control(confirmAction.action, confirmAction.name);
      setConfirmAction(null);
      setShowModal(false);
    }
  };

  /**
   * Cancels a process action by closing the confirmation modal
   * @returns {void}
   */
  const cancelAction = () => {
    setConfirmAction(null);
    setShowModal(false);
  };

  /**
   * Handles user login form submission
   * @param {Event} e - The form submission event
   * @returns {void}
   */
  const handleLogin = (e) => {
    e.preventDefault();
    if ((username === 'admin' || username === 'Admin') && password === 'admin') {
      setIsLoggedIn(true);
      setLoginError('');
      // Store username in localStorage for future use
      localStorage.setItem('pm2_credentials', JSON.stringify({
        username,
        timestamp: new Date().getTime()
      }));
    } else {
      setLoginError('Invalid username or password');
    }
  };

  /**
   * Handles user logout
   * @returns {void}
   */
  const handleLogout = () => {
    // Store credentials with timestamp before logging out
    localStorage.setItem('pm2_credentials', JSON.stringify({
      username,
      timestamp: new Date().getTime()
    }));
    setIsLoggedIn(false);
  };

  /**
   * Loads logs for all processes in a group
   * @param {string} groupName - The name of the group
   * @param {Array} processes - The processes in the group
   * @returns {void}
   */
  const loadGroupLogs = (groupName, processes) => {
    setSelected(groupName);
    // Get logs for all processes in the group and combine them
    Promise.all(
      processes.map(proc => 
        axios.get(appConfig.API_URL+`/api/process/logs/${proc.name}`)
          .then(res => `=== ${proc.name} ===\n${res.data}\n\n`)
      )
    ).then(logsArray => setLogs(logsArray.join('')));
  };

  // Calculate overall metrics for the main chart
  const processNames = processes.map(p => p.name);
  const filteredMetrics = metrics.filter(m => processNames.includes(m.name));


  /**
   * Renders the login form
   * @returns {JSX.Element} The login form component
   */
  const renderLoginForm = () => (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo">
          <img src="/pm2-pro-logo.png" alt="PM2 Pro Logo" />
        </div>
        <h2>Login to PM2 PRO</h2>
        <form onSubmit={handleLogin} autoCapitalize={"off"} autoComplete={"new-password"}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                autoCapitalize={"off"} autoComplete={"off"}
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                autoCapitalize={"off"} autoComplete={"off"}
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {loginError && <div className="error-message">{loginError}</div>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  /**
   * Toggles the mobile navigation menu
   * @returns {void}
   */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  /**
   * Handles navigation to a different page
   * @param {string} page - The page to navigate to
   * @returns {void}
   */
  const handleNavigate = (page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  return (
    <Router>
      <div className="app">
        {isLoggedIn && (
          <header className="app-header">
            <div className="header-content">
              <div className="logo">
                <img src="/pm2-pro-logo.png" alt="PM2 Pro Logo" />
              </div>
              <div className={`hamburger-menu ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <Navigator activePage={activePage} onNavigate={handleNavigate} menuOpen={menuOpen} />
              <div className={`overlay ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
              <div className="user-info">
                <span>Welcome, {username}</span>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </header>
        )}

        {isLoggedIn ? (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={
              <Dashboard 
                processes={processes} 
                metrics={metrics} 
                logs={logs} 
                selected={selected} 
                expandedGroups={expandedGroups} 
                handleAction={handleAction} 
                loadLogs={loadLogs} 
                loadGroupLogs={loadGroupLogs} 
                toggleGroup={toggleGroup} 
              />
            } />
            <Route path="/metrics" element={<Metrics processes={processes} metrics={metrics} />} />
            <Route path="/logs" element={<Logs processes={processes} loadLogs={loadLogs} logs={logs} selected={selected} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        ) : renderLoginForm()}

        {showModal && confirmAction && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirmation</h3>
              <p>Are you sure you want to {confirmAction.action} {confirmAction.name}?</p>
              <div className="modal-actions">
                <button onClick={cancelAction}>No</button>
                <button onClick={confirmActionHandler}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
