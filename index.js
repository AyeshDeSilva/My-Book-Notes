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

let books = [];

app.get("/", async (req, res) => {

    try{

        const result = await db.query("Select * from booknote order by id asc");

        books = result.rows;
        console.log(result.rows);


        res.render("index.ejs", {bookLists: books});

    }catch(err){

        console.log(err.message)
    }

});


app.get("/add", async (req, res) => { res.render("add.ejs");});

app.get("/edit", async (req, res) => {res.render("edit.ejs");});


app.get("/recent", async (req, res) => {

    try{

        const result = await db.query("Select * from booknote order by id desc");

        books = result.rows;
        console.log(result.rows);


        res.render("index.ejs", {bookLists: books});

    }catch(err){

        console.log(err.message)
    }
});

app.get("/rating", async (req, res) => {
    
    try{

        const result = await db.query("Select * from booknote order by rating desc");

        books = result.rows;
        console.log(result.rows);


        res.render("index.ejs", {bookLists: books});

    }catch(err){

        console.log(err);
    }
});


app.post("/add", async (req, res) => {

    const book = req.body;

    try{

        const result = await db.query(
            "Insert into booknote (title, author, isbn, review, rating) values ($1, $2, $3, $4, $5)",
            [book.newTitle, book.newAuthor, book.newIsbn, book.newReview, book.newRating]
        );

        res.redirect("/");

    }catch(err){

        console.log(err);
    }

});

app.post("/edit", async (req, res) => {

    const bookIsbn = req.query.isbn


    try{

        const result = await db.query("Select * from booknote where isbn = $1", [bookIsbn]);
        const bookEdit = result.rows[0];

        res.render("edit.ejs", {bookToEdit: bookEdit});

    }catch(err){
        
        console.log(err);
    }
})

app.post("/edited", async (req, res) => {

    const book = req.body;


    try {

        const result = await db.query("Update booknotes set title=$1, author=$2, review=$3, rating=$4 where isbn = $5",
            [book.editTitle, book.editAuthor,  book.editReview, book.editRating, book.editIsbn]
        );

        res.redirect("/");

    }catch(err){

        console.log(err);
    }

});


app.post("/delete", async (req, res) => {

    const deleteId = req.body.id;

    try{

        const result = await db.query("Delete from booknote where id = $1", [deleteId] );

        res.redirect("/");

    }catch(err){

        console.log(err)
    }
});


app.listen(port, () => {
    console.log("Listening to port " + port);
});