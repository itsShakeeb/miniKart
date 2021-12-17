const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const formData = multer();
connectDB();

//Middleware
// for parsing application/json
// app.use(express.json({ extended: true }));

// for parsing application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
// app.use(formData.array());
app.use(express.static(`uploads/`));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server running" });
});

app.use("/v1/api/", require("./routes/api/AdminUser"));
app.use("/v1/api/", require("./routes/api/AdminLogin"));
app.use("/v1/api/", require("./routes/api/Products/Product"));

//listening database

const PORT = 5001;
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
