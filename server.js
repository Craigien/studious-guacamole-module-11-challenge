// Import libraries
const express = require('express');
const path = require('path');
const fs = require('fs');

// Point to database file
const database = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

// -------------- Routes ---------------------

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => res.json(database));

app.post('/api/notes', (req, res) => {
    const requestBody = req.body;
    console.log(`
    ------------------ Request Body ------------------`);
    console.log(requestBody);

    const { title, text } = req.body;

    if (title && text)
    {
        const newNote = {
            title,
            text
        };

        fs.appendFile('./db/db.json', newNote, (err) =>
            err ? console.error(err) : console.log("New note added to JSON file")
        );

        const response = {
            status: 'success',
            body: newNote
        };

        console.log(response);

        res.status(201).json(response);
    }

    else
    {
        res.status(500).json("Error posting new note");
    }
});
  
// app.delete('/api/notes/:id', (req, res) => res.send("Confirming that the DELETE ROUTE received this request"));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'))
// });

// ------------------ Start Server -----------------------
// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);