import React from 'react';

/**
 * Help component that displays documentation and usage instructions
 * @returns {JSX.Element} The help page component
 */
const Help = () => {
  return (
    <div className="help-page">
      <h1>PM2 Dashboard Help</h1>

      <div className="help-section">
        <h2>Getting Started</h2>
        <p>
          Welcome to the PM2 Dashboard! This tool helps you monitor and manage your PM2 processes.
          Here's a quick overview of what you can do:
        </p>
        <ul>
          <li>View real-time metrics for all your processes</li>
          <li>Start, stop, and restart processes</li>
          <li>View process logs</li>
          <li>Configure dashboard settings</li>
        </ul>
      </div>

      <div className="help-section">
        <h2>Dashboard Overview</h2>
        <p>
          The main dashboard displays all your PM2 processes, grouped by name. Each process shows:
        </p>
        <ul>
          <li><strong>Status:</strong> Online, stopped, or errored</li>
          <li><strong>CPU Usage:</strong> Current CPU usage percentage</li>
          <li><strong>Memory Usage:</strong> Current memory consumption</li>
          <li><strong>Actions:</strong> Buttons to manage the process</li>
        </ul>
        <p>
          Click on a process group to expand it and see individual processes within the group.
        </p>
      </div>

      <div className="help-section">
        <h2>Process Management</h2>
        <h3>Starting a Process</h3>
        <p>
          To start a stopped process, click the "Actions" button next to the process and select "Start".
          You'll be asked to confirm this action.
        </p>

        <h3>Stopping a Process</h3>
        <p>
          To stop a running process, click the "Actions" button and select "Stop".
          This will gracefully stop the process.
        </p>

        <h3>Restarting a Process</h3>
        <p>
          To restart a process, click the "Actions" button and select "Restart".
          This is useful if a process is behaving unexpectedly.
        </p>
      </div>

      <div className="help-section">
        <h2>Viewing Logs</h2>
        <p>
          To view logs for a process:
        </p>
        <ol>
          <li>Click the "Logs" button next to the process</li>
          <li>The logs will appear at the bottom of the dashboard</li>
          <li>You can also go to the dedicated Logs page for a better view</li>
        </ol>
        <p>
          The logs show the standard output and error streams from your process.
        </p>
      </div>

      <div className="help-section">
        <h2>Metrics</h2>
        <p>
          The Metrics page provides detailed performance information:
        </p>
        <ul>
          <li>Real-time CPU and memory usage graphs</li>
          <li>Top resource-consuming processes</li>
          <li>Historical performance data</li>
        </ul>
        <p>
          Use this information to identify performance bottlenecks and optimize your applications.
        </p>
      </div>

      <div className="help-section">
        <h2>Settings</h2>
        <p>
          The Settings page allows you to customize the dashboard:
        </p>
        <ul>
          <li>Change the data refresh interval</li>
          <li>Toggle dark/light mode</li>
          <li>Configure alert thresholds</li>
          <li>Set log retention periods</li>
        </ul>
      </div>

      <div className="help-section">
        <h2>Troubleshooting</h2>
        <h3>Process Won't Start</h3>
        <p>
          If a process won't start, check the logs for error messages. Common issues include:
        </p>
        <ul>
          <li>Missing dependencies</li>
          <li>Configuration errors</li>
          <li>Port conflicts</li>
        </ul>

        <h3>Dashboard Not Updating</h3>
        <p>
          If the dashboard isn't showing current data:
        </p>
        <ol>
          <li>Check your network connection</li>
          <li>Verify the PM2 API is running</li>
          <li>Try refreshing the page</li>
        </ol>
      </div>

      <div className="help-section">
        <h2>Need More Help?</h2>
        <p>
          For additional assistance:
        </p>
        <ul>
          <li>Consult the <a href="https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/" target="_blank" rel="noopener noreferrer">PM2 Documentation</a></li>
          <li>Visit the <a href="https://github.com/Unitech/pm2/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a> page</li>
          <li>Contact your system administrator</li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
