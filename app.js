require("dotenv").config();
const express = require("express");
const path = require("node:path");

//Routers


const app = express();
const assetsPath = path.join(__dirname, "public");

process.on('uncaughtException', (err) => {
    console.log(err);
})

app.use(express.urlencoded({extended:true}));
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.send("Hello, World");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Classroom Manager - listening on port ${PORT}`);
})