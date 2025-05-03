import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

/**
 * Metrics component that displays process performance metrics
 * @param {Object} props - Component props
 * @param {Array} props.processes - List of PM2 processes
 * @param {Array} props.metrics - Process metrics data
 * @returns {JSX.Element} The metrics page component
 */
const Metrics = ({ processes, metrics }) => {
  /**
   * Calculate overall metrics for the main chart
   */
  const processNames = processes.map(p => p.name);
  const filteredMetrics = metrics.filter(m => processNames.includes(m.name));

  // Prepare data for CPU usage by process
  const cpuData = processes.map(proc => ({
    name: proc.name,
    cpu: proc.monit.cpu
  })).sort((a, b) => b.cpu - a.cpu).slice(0, 10); // Top 10 by CPU

  // Prepare data for Memory usage by process
  const memoryData = processes.map(proc => ({
    name: proc.name,
    memory: proc.monit.memory / 1024 / 1024 // Convert to MB
  })).sort((a, b) => b.memory - a.memory).slice(0, 10); // Top 10 by Memory

  return (
    <div className="metrics-page">
      <h1>System Metrics</h1>

      <div className="metrics-section">
        <h2>Real-time Process Metrics</h2>
        <div className="metrics-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredMetrics}>
              <Line type="monotone" dataKey="cpu" stroke="#82ca9d" name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#8884d8" name="Memory" />
              <CartesianGrid stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metrics-section">
          <h2>Top CPU Usage</h2>
          <div className="metrics-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cpuData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cpu" fill="#82ca9d" name="CPU %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="metrics-section">
          <h2>Top Memory Usage</h2>
          <div className="metrics-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="memory" fill="#8884d8" name="Memory (MB)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="metrics-section">
        <h2>Process Statistics</h2>
        <div className="metrics-table">
          <table>
            <thead>
              <tr>
                <th>Process Name</th>
                <th>Status</th>
                <th>CPU (%)</th>
                <th>Memory (MB)</th>
                <th>Uptime</th>
                <th>Restarts</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(proc => (
                <tr key={proc.pm_id}>
                  <td>{proc.name}</td>
                  <td className={`status ${proc.pm2_env.status}`}>{proc.pm2_env.status}</td>
                  <td>{proc.monit.cpu.toFixed(1)}%</td>
                  <td>{(proc.monit.memory / 1024 / 1024).toFixed(1)} MB</td>
                  <td>{proc.pm2_env.pm_uptime ? formatUptime(proc.pm2_env.pm_uptime) : 'N/A'}</td>
                  <td>{proc.pm2_env.restart_time || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function to format uptime in a human-readable format
 * @param {number} uptime - The timestamp when the process started
 * @returns {string} Formatted uptime string (e.g., "2d 5h", "3h 45m", "30s")
 */
const formatUptime = (uptime) => {
  const now = Date.now();
  const uptimeMs = now - uptime;
  const seconds = Math.floor(uptimeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

export default Metrics;
