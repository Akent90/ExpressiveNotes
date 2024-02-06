const express = require('express');
const path = require('path');
const fs = require('fs');

// Initialize express 
const app = express();
const PORT = process.env.PORT || 3000;

// Midleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// API route for getting notes 
app.get('/api/notes', (req, res) => {
fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        return res.status(500).send('Error reading notes');
    }
    res.json(JSON.parse(data));
});
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading notes');
        }
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                return res.status(500).send('Error saving the note');
            }
            res.json(newNote);
        });
    });
});