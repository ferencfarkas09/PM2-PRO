# PM2 Dashboard

A free, open-source dashboard for monitoring and managing PM2 processes.

![PM2 Dashboard](https://happy-releases.fra1.cdn.digitaloceanspaces.com/Uploads/PM2PRO/pm2pro-screenshot.png)

## Features

- Real-time monitoring of PM2 processes
- Process management (start, stop, restart)
- View process logs
- Performance metrics visualization
- Group management for clustered processes
- Dark mode interface
- Responsive design for desktop and mobile

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PM2 installed globally (`npm install -g pm2`)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ferencfarkas09/pm2-dashboard.git
   cd pm2-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run start-all
   ```

The dashboard will be available at http://localhost:3000, and the backend API will run on http://localhost:3001.

### Production Deployment

To deploy to production:

1. Build the frontend:
   ```bash
   npm run build-frontend
   ```

2. Start the backend with PM2:
   ```bash
   npm run start-pm2-backend
   ```

## Usage

### Authentication

The dashboard uses a simple authentication system:
- Username: `admin`
- Password: `admin`

For production use, it's recommended to modify the authentication logic in `App.js`.

### Dashboard

The main dashboard displays all your PM2 processes, grouped by name. Each process shows:
- Status (online, stopped, errored)
- CPU usage
- Memory usage
- Real-time performance graph

### Process Management

You can manage processes directly from the dashboard:
1. Click the "Actions" button next to a process
2. Select the desired action (Start, Stop, Restart)
3. Confirm the action in the dialog

### Viewing Logs

To view logs for a process:
1. Click the "Logs" button next to the process
2. The logs will appear at the bottom of the dashboard
3. You can also go to the dedicated Logs page for a better view

## Architecture

The application consists of two main parts:

### Frontend

- Built with React.js
- Uses Socket.IO for real-time updates
- Recharts for data visualization
- SCSS for styling

### Backend

- Express.js server
- PM2 Node.js API for process management
- Socket.IO for real-time metrics broadcasting
- RESTful API endpoints for process control

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/processes` - List all PM2 processes
- `POST /api/process/start` - Start a process
- `POST /api/process/stop` - Stop a process
- `POST /api/process/restart` - Restart a process
- `GET /api/process/logs/:name` - Get logs for a specific process

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## Author

Ferenc Farkas - [GitHub](https://github.com/ferencfarkas09)