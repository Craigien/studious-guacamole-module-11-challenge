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

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// -------------- Routes ---------------------
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {

    let root = {
        root: path.join(__dirname, 'db')
    };

    return res.sendFile(database, root);
});

app.post('/api/notes', (req, res) => {
    
    console.log(`
    ------------------ Request Body ------------------`);
    console.log(req.body);

    const { title, text } = req.body;

    if (title && text)
    {
        const newNote = {
            title,
            text,
            id: jsonuuid.id(title)
        };

        console.log("New Note: " + newNote);

        fs.readFile('./db/db.json', (err, data) => {
            // err ? console.error(err) : console.log(data)

            let databaseParsed = JSON.parse(data);
            databaseParsed.push(newNote);

            console.log(databaseParsed);

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
  
app.delete('/api/notes/:id', (req, res) => {

    const id = req.params.id;

    console.log("id: " + id);

    fs.readFile('./db/db.json', (err, data) => {
        err ? console.error(err) : console.log(data)

        let parsedDatabase = JSON.parse(data);

        console.log(parsedDatabase);

        const newDatabase = parsedDatabase.filter((note) => note.id !== id);

        fs.writeFile('./db/db.json', JSON.stringify(newDatabase), (err) =>
        err ? console.error(err) : console.log("Removed note with id of: " + id)
        );

        return res.json('Successfully deleted note with ID of ' + + id);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// ------------------ Start Server -----------------------
// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);

// To Do

// Comments
// README