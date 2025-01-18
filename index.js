const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: "*",
  })
);

app.use(express.json());
const bookRouter = require("./routes/book.router");

app.use("/api", bookRouter);

app.listen(process.env.PORT, () =>
  console.log("Server is running on port 3000")
);
