/**
 * PM2 Dashboard Backend Server
 * Provides API endpoints for managing PM2 processes and real-time metrics
 * @module server
 */

const express = require('express');
const pm2 = require('pm2');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cors = require('cors');

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend/build'));

/**
 * List all PM2 processes
 * @route GET /api/processes
 * @returns {Object[]} 200 - List of PM2 processes
 * @returns {Error} 500 - Server error
 */
app.get('/api/processes', (req, res) => {
  pm2.connect(() => {
    pm2.list((err, list) => {
      if (err) return res.status(500).send(err);
      res.json(list);
      pm2.disconnect();
    });
  });
});

/**
 * Start a PM2 process
 * @route POST /api/process/start
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Name of the process to start
 * @returns {Object} 200 - Process information
 * @returns {Error} 500 - Server error
 */
app.post('/api/process/start', (req, res) => {
  const { name } = req.body;
  pm2.connect(() => {
    pm2.start(name, (err, proc) => {
      if (err) return res.status(500).send(err);
      res.json(proc);
      pm2.disconnect();
    });
  });
});

/**
 * Stop a PM2 process
 * @route POST /api/process/stop
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Name of the process to stop
 * @returns {Object} 200 - Status object
 * @returns {Error} 500 - Server error
 */
app.post('/api/process/stop', (req, res) => {
  const { name } = req.body;
  pm2.connect(() => {
    pm2.stop(name, (err) => {
      if (err) return res.status(500).send(err);
      res.json({ status: 'stopped' });
      pm2.disconnect();
    });
  });
});

/**
 * Restart a PM2 process
 * @route POST /api/process/restart
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Name of the process to restart
 * @returns {Object} 200 - Process information
 * @returns {Error} 500 - Server error
 */
app.post('/api/process/restart', (req, res) => {
  const { name } = req.body;
  pm2.connect(() => {
    pm2.restart(name, (err, proc) => {
      if (err) return res.status(500).send(err);
      res.json(proc);
      pm2.disconnect();
    });
  });
});

/**
 * Get logs for a PM2 process
 * @route GET /api/process/logs/:name
 * @param {string} req.params.name - Name of the process to get logs for
 * @returns {string} 200 - Process logs
 * @returns {Error} 500 - Server error
 */
app.get('/api/process/logs/:name', (req, res) => {
  const name = req.params.name;
  const { exec } = require('child_process');
  exec(`pm2 logs ${name} --lines 100 --raw`, { timeout: 5000 }, (err, stdout, stderr) => {
    if (err) return res.status(500).send(stderr);
    res.type('text/plain').send(stdout);
  });
});

/**
 * Socket.IO connection for real-time metrics
 * Emits process metrics every 5 seconds
 * @event connection
 * @param {Object} socket - Socket.IO socket object
 */
io.on('connection', (socket) => {
  /**
   * Interval for sending metrics to the client
   * @type {number}
   */
  const interval = setInterval(() => {
    pm2.connect(() => {
      pm2.list((err, list) => {
        if (err) return;
        /**
         * Process metrics data
         * @type {Object[]}
         */
        const metrics = list.map(p => ({
          name: p.name,
          cpu: p.monit.cpu,
          memory: p.monit.memory
        }));
        socket.emit('metrics', metrics);
        pm2.disconnect();
      });
    });
  }, 5000);

  /**
   * Handle socket disconnection
   * @event disconnect
   */
  socket.on('disconnect', () => clearInterval(interval));
});

/**
 * Start the server
 * @listens {http.Server}
 */
server.listen(3001, () => console.log('Backend running on http://localhost:3001'));
