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

// API route for adding a new note 
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    // Read notes, add the new note, write back to db.json
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

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading notes');
        }
        const notes = JSON.parse(data);
        const filteredNotes = notes.filter(note => note.id !== req.params.id);

        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
            if (err) {
                return res.status(500).send('Error deleting the note');
            }
            res.json({ message: 'Note deleted successfully' });
        });
    });
});