const express = require("express");
const axios = require("axios");
const lowdb = require("lowdb");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = lowdb(adapter);

app.use(express.static("public"));
app.use(express.static("assets"));
app.use(express.static("styles"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/chat", async (req, res) => {
  const message = req.query.message;

  // Send the user's message to the ChatGPT API
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.6,
      model: "gpt-3.5-turbo",
    },
    {
      headers: {
        Authorization:"Bearer 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"
      },
    }
  );

  res.send(response.data.choices[0].message.content);
});

app.get("/miralender", (req, res) => {
  res.sendFile(__dirname + "/public/miralender.html");
});

app.get("/chatbot", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});

// pomodoro
app.get("/pomodoro", (req, res) => {
  res.sendFile(__dirname + "/public/pomodoro.html");
});

// For calendar
app.get("/schedules", (req, res) => {
  const users = db.get("schedules").value();
  res.json(users);
});

// POST route to add a new user
app.post("/schedules", (req, res) => {
  const newSchedule = req.body;
  db.get("schedules").push(newSchedule).write();
  res.json(newSchedule);
});

app.post("/delete-schedule", (req, res) => {
  const toDelete = req.body;
  db.get('schedules').remove({ description: toDelete.description}).write();
  res.json("okay");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
