const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
connectDB();

//Middleware
// for parsing application/json
// app.use(express.json({ extended: true }));

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server running" });
});

app.use("/v1/api/", require("./routes/api/AdminUser"));
app.use("/v1/api/", require("./routes/api/AdminLogin"));
app.use("/v1/api/", require("./routes/api/Products/Product"));
app.use("/v1/api/", require("./routes/api/uploadImages/uploadImages"));
app.use("/v1/api/", require("./routes/api/Products/CategoriesOfProduct"));

//listening database

const PORT = 5001;
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
