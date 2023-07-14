// Import libraries
const express = require('express');
const path = require('path');
const fs = require('fs');

// Used to create UUID for each note
const jsonuuid = require('json-uuid');

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
    // const requestBody = req.body;
    // console.log(`
    // ------------------ Request Body ------------------`);
    // console.log(requestBody);

    // res.json(`${req.method} request received`);

    // console.info(req.rawHeaders);

    // console.info(`${req.method} request received`);

    const { title, text } = req.body;

    if (title && text)
    {
        let databaseParsed;

        const newNote = {
            title,
            text,
            UUID: jsonuuid.id()
        };

        fs.readFile('./db/db.json', (err, data) => {
            err ? console.error(err) : console.log(data)

            databaseParsed = JSON.parse(data);
            databaseParsed.push(newNote);

            console.log(databaseParsed);

            fs.writeFile('./db/db.json', JSON.stringify(databaseParsed), (err) =>
            err ? console.error(err) : console.log("New note added to JSON file")
            );
        });

        const response = {
            status: 'success',
            body: newNote
        };
        
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