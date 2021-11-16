const express = require("express");
const fs = require("fs");
const noteData = require("./db/db.json");

const path = require("path");
const PORT = 443;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => res.json(noteData));

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    let newNote = {
      id: title.toLowerCase().split(" ").join("-"),
      title: title,
      text: text,
    };
    noteData.push(newNote);
    const response = {
      status: "success",
      body: newNote,
    };
    fs.writeFile(
      path.join(__dirname, "db", "db.json"),
      JSON.stringify(noteData),
      (err) => {
        err
          ? res.status(500).json("Error in saving note")
          : res.status(201).json(response);
      }
    );
  } else {
    res.status(400).json("Note request must contain title and text properties");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const noteToDeleteId = req.params.id;
  for (let i = 0; i < noteData.length; i++) {
    let currNote = noteData[i];
    if (currNote.id == noteToDeleteId) {
      noteData.splice(i, 1);
      break;
    }
  }
  const response = {
    status: "success",
  };
  fs.writeFile(
    path.join(__dirname, "db", "db.json"),
    JSON.stringify(noteData),
    (err) => {
      err
        ? res.status(500).json("Error in deleting note")
        : res.status(201).json(response);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
