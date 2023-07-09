const express = require('express');
const path = require('path');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// -------------- Routes ---------------------
app.get('/*', (req, res) => {
    res.send(`Default GET Route and method received`)
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.post('/api/notes', (req, res) => {
    const requestBody = req.body;
    console.log(`
    ------------------ Request Body ------------------`);
    console.log(requestBody);
    res.json(requestBody);
});
  
app.delete('/api/notes/:id', (req, res) => res.send("Confirming that the DELETE ROUTE received this request"));

// ------------------ Start Server -----------------------
// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);