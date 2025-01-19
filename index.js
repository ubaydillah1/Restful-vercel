const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

app.options("*", cors());

app.use(
  cors({
    origin: ["https://explore-hd-site.webflow.io", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use("/assets", express.static("public/images"));

const bookRouter = require("./routes/book.router");
const upload = require("./middleware/multer");

app.use("/api", bookRouter);

app.listen(process.env.PORT, () =>
  console.log("Server is running on port 3000")
);
