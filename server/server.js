const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const Style = require("./models/Style");

// App
const app = express();

// connect to mongoose
mongoose
  .connect(
    process.env.DB_HOST,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

// index route
app.get("/", (req, res) => {
  res.render("index");
});

// upload route
//app.post("/upload", upload.single("file"), (req, res) => {});

// styles route
app.get("/styles", (req, res) => {
  Style.find()
    .sort([["styleNum", "asc"]])
    .then(styles => {
      res.render("styles", {
        styles: styles
      });
    });
});

app.listen(process.env.APP_PORT, (req, res) => {
  console.log(
    `REST API running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`
  );
});
