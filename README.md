# School Management API

A Node.js REST API for managing school locations and calculating proximity.

## Features
- Add new schools with location data
- List schools sorted by distance from a given location
- MySQL database integration
- Input validation
- Distance calculation using Haversine formula

## Prerequisites
- Node.js (v14 or higher)
- MySQL

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd school-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=school_management
PORT=3000
```

4. Set up the database:
- Create a MySQL database named 'school_management'
- The tables will be automatically created when you start the server

## Running the Application

```bash
npm start
```

The server will start on http://localhost:3000

## API Endpoints

### Add School
- **POST** `/addSchool`
- Body:
```json
{
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.9716,
    "longitude": 77.5946
}
```

### List Schools
- **GET** `/listSchools?latitude=12.9716&longitude=77.5946`
- Query Parameters:
  - latitude: User's latitude
  - longitude: User's longitude

## Testing
Import the provided Postman collection (`School_Management_API.postman_collection.json`) to test the APIs.

## Deployment
1. Set up your production MySQL database
2. Update the `.env` file with production credentials
3. Deploy to your preferred hosting service (e.g., Heroku, AWS, DigitalOcean)

## Files Required for Deployment
- `package.json` - Dependencies and scripts
- `server.js` - Main application file
- `config/db.js` - Database configuration
- `utils/validation.js` - Validation schemas and utilities
- `.env` (create from `.env.example`) - Environment variables
- `README.md` - Documentation
- `.gitignore` - Git ignore rules
