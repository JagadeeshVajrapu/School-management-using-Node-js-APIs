<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Add School API
app.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'School added successfully', id: result.insertId });
    });
});

// List Schools API (Sorted by Proximity)
app.get('/listSchools', (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }
    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = x => (x * Math.PI) / 180;
            const R = 6371; 
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        results.sort((a, b) => calculateDistance(lat, lng, a.latitude, a.longitude) - calculateDistance(lat, lng, b.latitude, b.longitude));
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306, // Use the port Railway provides in the DB settings
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Add School API
app.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'School added successfully', id: result.insertId });
    });
});

// List Schools API (Sorted by Proximity)
app.get('/listSchools', (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }
    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = x => (x * Math.PI) / 180;
            const R = 6371; 
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        results.sort((a, b) => calculateDistance(lat, lng, a.latitude, a.longitude) - calculateDistance(lat, lng, b.latitude, b.longitude));
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> b38af61 (Initial commit)
