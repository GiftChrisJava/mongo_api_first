const { MongoClient } = require("mongodb");

let dbConnection;
let uri =
  "mongodb+srv://yaza:0000-0000@cluster0.mfaza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

module.exports = {
  connectToDb: (callback) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return callback();
      })
      .catch((err) => {
        console.log(err);
        return callback(err);
      });
  },

  getDb: () => dbConnection,
};
