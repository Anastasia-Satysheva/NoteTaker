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

app.get("/api/notes", (req, res) => {
    let obj = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
    return res.json(obj);
});

app.post('/api/notes', (req, res) => {
    let body = '';
    req.on('data', data => {
        body += data.toString();
    }).on('end', () => {
        const note = parse(body);

        if (Object.keys(note).length !== 0) {
            fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }

                data = JSON.parse(data);
                note.id = data.length;
                data.push(note);

                fs.writeFile(__dirname + '/db/db.json', JSON.stringify(data), err => {
                    if (err) throw err;
                    console.log('Success!')
                });
            });
            res.send(note);
        } else {
            throw new Error('Error!');
        }
    });
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, noteList) => {
        if (err) {
            throw err;
        }

        noteList = JSON.parse(noteList);
        for (let i = 0; i < noteList.length; i++) {
            if (noteList[i].id === parseInt(id)) {
                noteList.splice(i, 1);
            }
        }

        fs.writeFile(__dirname + '/db/db.json', JSON.stringify(noteList), err => {
            if (err) throw err;

            console.log('Success!')
        });
    });

    res.send('Deleted');
})
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});