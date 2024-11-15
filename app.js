const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

//init
const app = express();

// middleware
app.use(express.json());
// database connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Server is up and running on port 3000");
    });

    db = getDb();
  }
});

//routes
// app.get("/", (req, res) => {
//   res.json({ msg: "Welcome to the api" });
// });

app.get("/books", (req, res) => {
  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Couldn't fetch the documents" });
    });
});

// getting a document by id
app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) }) // Use 'new' keyword here
      .then((doc) => {
        if (doc) {
          res.status(200).json(doc); // Corrected status code to 200
        } else {
          res.status(404).json({ error: "Document not found" });
        }
      })
      .catch((err) => {
        console.error("Error fetching document:", err); // Log the error
        res.status(500).json({ error: "Couldn't fetch the document" });
      });
  } else {
    res.status(400).json({ msg: "Invalid id" }); // Use 400 for invalid request
  }
});

// posting a book
app.post("/books", (req, res) => {
  const book = req.body;
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ msg: "Error posting book" });
    });
});
