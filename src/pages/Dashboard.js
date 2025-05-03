import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * Dashboard component that displays process information, metrics, and logs
 * @param {Object} props - Component props
 * @param {Array} props.processes - List of PM2 processes
 * @param {Array} props.metrics - Process metrics data
 * @param {string} props.logs - Process logs content
 * @param {string|null} props.selected - Currently selected process for logs
 * @param {Object} props.expandedGroups - Object tracking which process groups are expanded
 * @param {Function} props.handleAction - Function to handle process actions (start, stop, restart)
 * @param {Function} props.loadLogs - Function to load logs for a specific process
 * @param {Function} props.loadGroupLogs - Function to load logs for a group of processes
 * @param {Function} props.toggleGroup - Function to toggle group expansion
 * @returns {JSX.Element} The dashboard component
 */
const Dashboard = ({ 
  processes, 
  metrics, 
  logs, 
  selected, 
  expandedGroups, 
  handleAction, 
  loadLogs, 
  loadGroupLogs, 
  toggleGroup 
}) => {
  /**
   * Groups processes by name prefix
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

  // Calculate overall metrics for the main chart
  const processNames = processes.map(p => p.name);
  const filteredMetrics = metrics.filter(m => processNames.includes(m.name))
    .map(m => ({
      ...m,
      memory: m.memory / 1024 / 1024 // Convert to MB for better visualization
    }));

  return (
    <div className={"padding"}>
      <div className="main-chart">
        <h2>Overall System Metrics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredMetrics}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
            <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpu" stroke="#82ca9d" name="CPU %" strokeWidth={2} yAxisId="left" />
            <Line type="monotone" dataKey="memory" stroke="#8884d8" name="Memory (MB)" strokeWidth={2} yAxisId="right" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard">
        {Object.entries(groupProcesses()).map(([groupName, groupProcesses]) => {
          const isGroup = groupProcesses.length > 1;
          const isExpanded = expandedGroups[groupName];

          // Calculate group metrics
          const totalCpu = groupProcesses.reduce((sum, proc) => sum + proc.monit.cpu, 0);
          const avgCpu = totalCpu / groupProcesses.length;
          const totalMemory = groupProcesses.reduce((sum, proc) => sum + proc.monit.memory, 0);

          // Get statuses
          const statuses = [...new Set(groupProcesses.map(proc => proc.pm2_env.status))];
          const groupStatus = statuses.length === 1 ? statuses[0] : 'mixed';

          return (
            <div 
              className={`process-row ${isGroup ? 'group' : ''} ${isExpanded ? 'expanded' : ''}`} 
              key={groupName}
            >
              <div className="process-header" onClick={() => isGroup && toggleGroup(groupName)}>
                <div className="process-info">
                  <h2>{groupName} {isGroup && <span className="count">({groupProcesses.length} process)</span>}</h2>
                  <div className="process-details">
                    <p className={`status ${groupStatus}`}>Status: {groupStatus}</p>
                    <p>CPU: {isGroup ? avgCpu.toFixed(1) : groupProcesses[0].monit.cpu}%</p>
                    <p>Memory: {(isGroup ? totalMemory / 1024 / 1024 : groupProcesses[0].monit.memory / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>

                <div className="process-graph">
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={metrics.filter(m => m.name.startsWith(groupName))
                      .map(m => ({
                        ...m,
                        memory: m.memory / 1024 / 1024 // Convert to MB for better visualization
                      }))}>
                      <YAxis yAxisId="left" hide={true} />
                      <YAxis yAxisId="right" hide={true} />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#82ca9d" dot={false} strokeWidth={2} yAxisId="left" />
                      <Line type="monotone" dataKey="memory" stroke="#8884d8" dot={false} strokeWidth={2} yAxisId="right" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="process-actions">
                  <div className="dropdown">
                    <button className="action-button">Actions</button>
                    <div className="dropdown-content">
                      <button onClick={(e) => { e.stopPropagation(); handleAction('start', groupName); }}>
                        Start
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleAction('stop', groupName); }}>
                        Stop
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleAction('restart', groupName); }}>
                        Restart
                      </button>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); isGroup ? loadGroupLogs(groupName, groupProcesses) : loadLogs(groupProcesses[0].name); }}>
                    Logs
                  </button>
                </div>
              </div>

              {isGroup && isExpanded && (
                <div className="process-children">
                  {groupProcesses.map(proc => (
                    <div className="child-process" key={proc.pm_id}>
                      <div className="process-info">
                        <h3>{proc.name}</h3>
                        <div className="process-details">
                          <p className={`status ${proc.pm2_env.status}`}>Status: {proc.pm2_env.status}</p>
                          <p>CPU: {proc.monit.cpu}%</p>
                          <p>Memory: {(proc.monit.memory / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                      </div>

                      <div className="process-graph">
                        <ResponsiveContainer width="100%" height={30}>
                          <LineChart data={metrics.filter(m => m.name === proc.name)
                            .map(m => ({
                              ...m,
                              memory: m.memory / 1024 / 1024 // Convert to MB for better visualization
                            }))}>
                            <YAxis yAxisId="left" hide={true} />
                            <YAxis yAxisId="right" hide={true} />
                            <Tooltip />
                            <Line type="monotone" dataKey="cpu" stroke="#82ca9d" dot={false} strokeWidth={2} yAxisId="left" />
                            <Line type="monotone" dataKey="memory" stroke="#8884d8" dot={false} strokeWidth={2} yAxisId="right" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="process-actions">
                        <div className="dropdown">
                          <button className="action-button">Actions</button>
                          <div className="dropdown-content">
                            <button onClick={() => handleAction('start', proc.name)}>
                              Start
                            </button>
                            <button onClick={() => handleAction('stop', proc.name)}>
                              Stop
                            </button>
                            <button onClick={() => handleAction('restart', proc.name)}>
                              Restart
                            </button>
                          </div>
                        </div>
                        <button onClick={() => loadLogs(proc.name)}>Logs</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="logs" style={{width: 'unset'}}>
          <h3>Logs: {selected}</h3>
          <pre>{logs}</pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
