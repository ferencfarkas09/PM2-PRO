import React, { useState } from 'react';

/**
 * Settings component that allows users to configure dashboard preferences
 * @returns {JSX.Element} The settings page component
 */
const Settings = () => {
  /**
   * State for dashboard settings
   * @type {Object}
   * @property {number} refreshInterval - Data refresh interval in seconds
   * @property {boolean} darkMode - Whether dark mode is enabled
   * @property {number} logRetentionDays - Number of days to retain logs
   * @property {boolean} alertsEnabled - Whether alerts are enabled
   * @property {number} cpuThreshold - CPU usage threshold for alerts (%)
   * @property {number} memoryThreshold - Memory usage threshold for alerts (%)
   * @property {string} apiEndpoint - API endpoint URL
   */
  const [settings, setSettings] = useState({
    refreshInterval: 5,
    darkMode: true,
    logRetentionDays: 7,
    alertsEnabled: true,
    cpuThreshold: 80,
    memoryThreshold: 90,
    apiEndpoint: 'http://217.16.177.156:3001'
  });

  /**
   * Handles changes to form inputs
   * @param {Event} e - The input change event
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  /**
   * Handles form submission
   * @param {Event} e - The form submission event
   * @returns {void}
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save settings to backend or localStorage
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <h1>Dashboard Settings</h1>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h2>General Settings</h2>

          <div className="form-group">
            <label htmlFor="refreshInterval">Data Refresh Interval (seconds)</label>
            <input
              type="number"
              id="refreshInterval"
              name="refreshInterval"
              value={settings.refreshInterval}
              onChange={handleChange}
              min="1"
              max="60"
            />
          </div>

          <div className="form-group">
            <label htmlFor="darkMode">
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
              />
              Dark Mode
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="logRetentionDays">Log Retention Period (days)</label>
            <input
              type="number"
              id="logRetentionDays"
              name="logRetentionDays"
              value={settings.logRetentionDays}
              onChange={handleChange}
              min="1"
              max="90"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Alert Settings</h2>

          <div className="form-group">
            <label htmlFor="alertsEnabled">
              <input
                type="checkbox"
                id="alertsEnabled"
                name="alertsEnabled"
                checked={settings.alertsEnabled}
                onChange={handleChange}
              />
              Enable Alerts
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="cpuThreshold">CPU Alert Threshold (%)</label>
            <input
              type="number"
              id="cpuThreshold"
              name="cpuThreshold"
              value={settings.cpuThreshold}
              onChange={handleChange}
              min="1"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="memoryThreshold">Memory Alert Threshold (%)</label>
            <input
              type="number"
              id="memoryThreshold"
              name="memoryThreshold"
              value={settings.memoryThreshold}
              onChange={handleChange}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Connection Settings</h2>

          <div className="form-group">
            <label htmlFor="apiEndpoint">API Endpoint URL</label>
            <input
              type="text"
              id="apiEndpoint"
              name="apiEndpoint"
              value={settings.apiEndpoint}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="save-button">Save Settings</button>
          <button type="button" className="reset-button">Reset to Defaults</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
