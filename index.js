import bodyParser from "body-parser";
import express from "express";
import pg from "pg";


const app = express();
const port = 3000;


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BookNoteDB",
    password: "Vector148",
    port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", async (req, res) => {

    res.render("index.ejs");
});

app.get("/add", async (req, res) => {
    res.render("add.ejs");
})

app.get("/edit", async (req, res) => {
    res.render("edit.ejs");
})

app.get("/recent", async (req, res) => {res.render("index.ejs")});

app.get("/rating", async (req, res) => {res.render("index.ejs")});

app.post("/add", async (req, res) => {

    res.redirect("/");
});

app.post("/edit", async (req, res) => {

    res.redirect("/");

});


app.post("/delete", async (req, res) => {
    res.render("/");

});

app.listen(port, () => {
    console.log("Listening to port " + port);
});