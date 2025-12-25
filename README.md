# Bourbon3 - Operation Manager

A static front-end application for managing mall operations including packages, staff, teams, and assignments.

## Getting Started

### Prerequisites

- Python 3.x installed on your system

### Starting the Development Server

1. Navigate to the project directory:
   ```bash
   cd /path/to/bourbon3
   ```

2. Start a local Python HTTP server:
   ```bash
   python3 -m http.server 8888
   ```

3. Open your browser and go to:
   ```
   http://localhost:8888
   ```

### Alternative Ports

If port 8888 is already in use, you can specify a different port:
```bash
python3 -m http.server 9000
```

Then access the app at `http://localhost:9000`.

## Project Structure

```
bourbon3/
├── index.html          # Main HTML entry point
├── css/
│   └── style.css       # Custom styles
├── js/
│   ├── app.js          # Main application controller
│   ├── api.js          # Mock API layer
│   └── views/          # View modules
│       ├── dashboardView.js
│       ├── packageView.js
│       ├── teamView.js
│       ├── staffView.js
│       └── assignmentView.js
└── data/
    └── mock_db.json    # Mock database
```

## Features

- **Dashboard** - Overview with stats and workload forecast
- **Packages** - Create and manage service packages
- **Staff** - View and manage staff members
- **Teams** - Manage teams and their assignments
- **Assignments** - Registry of professional services
