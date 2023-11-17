// server.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const multer = require("multer");
const path = require("path");

async function setupDatabase() {
  const db = await open({
    filename: "./mydb.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      data TEXT,
      published BOOLEAN DEFAULT FALSE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS slave_ids (
      id INTEGER PRIMARY KEY,
      slave_id INTEGER UNIQUE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slave_id INTEGER,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id INTEGER,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (message_id) REFERENCES messages (id)
    )
  `);

  return db;
}

// Configure multer to use original file names
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;

setupDatabase().then((database) => {
  db = database;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

app.post("/api/assignments", async (req, res) => {
  const { name, data } = req.body;
  try {
    const statement = await db.prepare(
      "INSERT INTO assignments (name, data) VALUES (?, ?)"
    );
    const result = await statement.run(name, JSON.stringify(data));
    statement.finalize();
    res.status(201).send({ id: result.lastID, name, data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/assignments", async (req, res) => {
  const { published } = req.query;
  try {
    let query = "SELECT * FROM assignments";
    if (published === "true") {
      query += " WHERE published = TRUE";
    }
    const rows = await db.all(query);
    res.status(200).send(rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE endpoint for assignments
app.delete("/api/assignments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const statement = await db.prepare("DELETE FROM assignments WHERE id = ?");
    const result = await statement.run(id);
    statement.finalize();
    if (result.changes > 0) {
      res.status(200).send({ message: "Assignment deleted" });
    } else {
      res.status(404).send({ message: "Assignment not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/api/publish/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.run(
      "UPDATE assignments SET published = TRUE WHERE id = ?",
      id
    );
    if (result.changes > 0) {
      res.status(200).send({ message: "Assignment published" });
    } else {
      res.status(404).send({ message: "Assignment not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST endpoint for file uploads
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    console.log(`Received file: ${req.file.originalname}`);
    res
      .status(200)
      .send({
        message: `File ${req.file.originalname} uploaded successfully.`,
      });
  } else {
    console.error("File upload failed.");
    res.status(400).send({ message: "No file uploaded." });
  }
});

// POST endpoint to set the current state of slave IDs
app.post("/api/slave-ids", async (req, res) => {
  const { slaveIDs } = req.body;
  try {
    // Clear existing slave IDs
    await db.run("DELETE FROM slave_ids");

    // Insert new set of slave IDs
    for (let id of slaveIDs) {
      await db.run("INSERT INTO slave_ids (slave_id) VALUES (?)", id);
    }
    res.status(201).send({ message: "Slave IDs updated successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET endpoint to retrieve slave IDs
app.get("/api/slave-ids", async (req, res) => {
  try {
    const rows = await db.all("SELECT slave_id FROM slave_ids");
    res.status(200).send(rows.map((row) => row.slave_id));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST endpoint to send a message from slave to master
app.post('/api/messages', async (req, res) => {
  const { slave_id, content } = req.body;
  try {
    const result = await db.run('INSERT INTO messages (slave_id, content) VALUES (?, ?)', [slave_id, content]);
    res.status(201).send({ message: 'Message sent successfully', id: result.lastID });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET endpoint for master to fetch all messages with their replies
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await db.all('SELECT * FROM messages');
    for (const message of messages) {
      const replies = await db.all('SELECT content FROM replies WHERE message_id = ?', [message.id]);
      message.replies = replies.map(reply => reply.content);
    }
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



// POST endpoint for master to reply to a message
app.post('/api/replies', async (req, res) => {
  const { message_id, content } = req.body;
  try {
    const result = await db.run('INSERT INTO replies (message_id, content) VALUES (?, ?)', [message_id, content]);
    res.status(201).send({ message: 'Reply sent successfully', id: result.lastID });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET endpoint for slave to fetch replies with original message content
app.get('/api/replies/:slaveId', async (req, res) => {
  const { slaveId } = req.params;
  try {
    const replies = await db.all(`
      SELECT replies.id, messages.content AS original_message, replies.content
      FROM replies
      JOIN messages ON replies.message_id = messages.id
      WHERE messages.slave_id = ?
    `, [slaveId]);
    res.status(200).send(replies);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


