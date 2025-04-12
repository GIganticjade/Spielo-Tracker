const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'entries.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API zum Abrufen der Einträge
app.get('/api/entries', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Fehler beim Lesen der Datei' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// API zum Speichern eines neuen Eintrags
app.post('/api/entries', (req, res) => {
  const newEntry = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    const entries = err ? [] : JSON.parse(data || '[]');
    entries.push(newEntry);

    fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Fehler beim Speichern der Datei' });
      }
      res.status(201).json(newEntry);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});