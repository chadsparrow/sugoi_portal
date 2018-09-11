const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const Style = require("./models/Style");

// Constants
const PORT = 5000;
const HOST = "localhost";

// App
const app = express();

// connect to mongoose
mongoose
  .connect(
    "mongodb://localhost/sugoi-proofs",
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// // index route
// app.get("/", (req, res) => {
//   res.render("index");
// });

// styles route
app.get("/", (req, res) => {
  Style.find()
    .sort([["styleNum", "asc"]])
    .then(styles => {
      res.render("styles", {
        styles: styles
      });
    });
});

app.listen(PORT, (req, res) => {
  console.log(`REST API running on http://${HOST}:${PORT}`);
});
