const express = require("express");
const { connectToDb, getDb } = require("./db");

//init
const app = express();

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
