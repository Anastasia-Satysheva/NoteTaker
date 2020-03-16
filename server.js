const express = require('express');
const fs = require('fs');
const { parse } = require('querystring');

const app = express();

app.use(express.static('public'))

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
});

app.get("/api/notes", function (req, res) {
    let obj = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
    return res.json(obj);
});

app.post('/api/notes', (req, res) => {
    let body = '';
    req.on('data', data => {
        body += data.toString();
    }).on('end', () => {
        const newNote = parse(body);

        if (Object.keys(newNote).length !== 0) {
            fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }

                data = JSON.parse(data);
                newNote.id = data.length;
                data.push(newNote);

                fs.writeFile(__dirname + '/db/db.json', JSON.stringify(data), err => {
                    if (err) throw err;
                    console.log('Success.')
                });
            });
            res.send(newNote);
        } else {
            throw new Error('Something went wrong.');
        }
    });
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, notes) => {
        if (err) {
            throw err;
        }

        notes = JSON.parse(notes);
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === parseInt(id)) {
                notes.splice(i, 1);
            }
        }

        fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), err => {
            if (err) throw err;

            console.log('Success.')
        });
    });

    res.send('Deleted.');
})
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});