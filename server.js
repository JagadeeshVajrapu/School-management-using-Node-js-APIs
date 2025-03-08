const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const { schoolSchema, coordinatesSchema, calculateDistance } = require('./utils/validation');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database and create table if not exists
async function initializeDatabase() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS schools (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                address VARCHAR(200) NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

// Add School API
app.post('/addSchool', async (req, res) => {
    try {
        const { error, value } = schoolSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { name, address, latitude, longitude } = value;
        const [result] = await db.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );

        res.status(201).json({
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List Schools API
app.get('/listSchools', async (req, res) => {
    try {
        const { error, value } = coordinatesSchema.validate({
            latitude: parseFloat(req.query.latitude),
            longitude: parseFloat(req.query.longitude)
        });

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { latitude, longitude } = value;
        const [schools] = await db.query('SELECT * FROM schools');

        // Calculate distance for each school and sort
        const schoolsWithDistance = schools.map(school => ({
            ...school,
            distance: calculateDistance(
                latitude,
                longitude,
                school.latitude,
                school.longitude
            )
        }));

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json({
            schools: schoolsWithDistance.map(school => ({
                id: school.id,
                name: school.name,
                address: school.address,
                latitude: school.latitude,
                longitude: school.longitude,
                distanceInKm: parseFloat(school.distance.toFixed(2))
            }))
        });
    } catch (error) {
        console.error('Error listing schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize database when server starts
initializeDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
