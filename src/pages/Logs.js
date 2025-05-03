import React, { useState } from 'react';

/**
 * Logs component that displays process logs
 * @param {Object} props - Component props
 * @param {Array} props.processes - List of PM2 processes
 * @param {Function} props.loadLogs - Function to load logs for a specific process
 * @param {string} props.logs - Process logs content
 * @param {string|null} props.selected - Currently selected process for logs
 * @returns {JSX.Element} The logs page component
 */
const Logs = ({ processes, loadLogs, logs, selected }) => {
  const [filter, setFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  /**
   * Filter processes based on search term
   */
  const filteredProcesses = processes.filter(proc => 
    proc.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="logs-page">
      <h1>Process Logs</h1>

      <div className="logs-controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Filter processes..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="refresh-control">
          <label>
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={() => setAutoRefresh(!autoRefresh)}
            />
            Auto-refresh logs
          </label>
        </div>
      </div>

      <div className="logs-container">
        <div className="process-list">
          <h2>Processes</h2>
          <ul>
            {filteredProcesses.map(proc => (
              <li 
                key={proc.pm_id} 
                className={selected === proc.name ? 'active' : ''}
                onClick={() => loadLogs(proc.name)}
              >
                <div className="process-name">{proc.name}</div>
                <div className={`process-status ${proc.pm2_env.status}`}>{proc.pm2_env.status}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="logs-view">
          {selected ? (
            <>
              <h2>Logs: {selected}</h2>
              <div className="logs-actions">
                <button onClick={() => loadLogs(selected)}>Refresh</button>
                <button>Clear</button>
                <button>Download</button>
              </div>
              <pre className="logs-content">{logs}</pre>
            </>
          ) : (
            <div className="no-logs">
              <p>Select a process to view logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
