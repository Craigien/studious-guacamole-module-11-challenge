// Import libraries
const express = require('express');
const path = require('path');
const fs = require('fs');

// Used to create UUID for each note
const jsonuuid = require('json-uuid');

// Point to database file
const database = 'db.json';

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Set default route to go to index.html page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// -------------- Routes ---------------------

// Notes routes will return notes.html page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Returns all notes in db.json file
app.get('/api/notes', (req, res) => {

    let root = {
        root: path.join(__dirname, 'db')
    };

    return res.sendFile(database, root);
});

// Add new note to database
app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;

    if (title && text)
    {
        const newNote = {
            title,
            text,
            id: jsonuuid.id(title)
        };

        // Read all data from db.json as array and then push new note to it
        fs.readFile('./db/db.json', (err, data) => {

            let databaseParsed = JSON.parse(data);
            databaseParsed.push(newNote);

            // Write array into new db.json file
            fs.writeFile('./db/db.json', JSON.stringify(databaseParsed), (err) =>
            err ? console.error(err) : console.log("New note added to JSON file")
            );
        });
        
        return res.status(201).json(JSON.stringify(newNote));
    }

    else
    {
        res.status(500).json("Error posting new note");
    }
});

// Remove note using note ID parameter
app.delete('/api/notes/:id', (req, res) => {

    const id = req.params.id;

    fs.readFile('./db/db.json', (err, data) => {
        err ? console.error(err) : console.log(data)

        let parsedDatabase = JSON.parse(data);

        // Filter out note all notes other than the one that has a matching ID
        const newDatabase = parsedDatabase.filter((note) => note.id !== id);
        
        fs.writeFile('./db/db.json', JSON.stringify(newDatabase), (err) =>
        err ? console.error(err) : console.log("Removed note with id of: " + id)
        );

        return res.json('Successfully deleted note with ID of ' + id);
    });
});

// Any other route that is not specified in the server routes will return index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// ------------------ Start Server -----------------------
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);

// To Do

// README