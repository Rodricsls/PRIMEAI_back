const express = require("express");
const cors = require("cors");
const app= express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(cors());

app.set("port", PORT);

module.exports=app;