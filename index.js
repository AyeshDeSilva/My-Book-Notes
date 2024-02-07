import bodyParser from "body-parser";
import express from "express";
import pg from "pg";


//Initilize express and port number
const app = express();
const port = 3000;

//Initlize db information to connect
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BookNoteDB",
    password: " ",
    port: 5432
});

db.connect();

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Store book data in the array
let books = [];

//Route the data in the database to render in the main page
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

//Route to render the add page
app.get("/add", async (req, res) => { res.render("add.ejs");});


//Route to render the book lists from recent to least recent 
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

//Route to render the book lists from highest to lowest 
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

//Route to insert data to the database given from the form
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

//Route to render the informtaion into the edit form by clicking the edit button
app.get("/edit", async (req, res) => {

    const id = req.query.id;


    try{

        const result = await db.query("Select * from booknote where id = $1", [id]);
        const bookEdit = result.rows[0];

        res.render("edit.ejs", {bookEdit});

    }catch(err){
        
        console.log(err);
    }
})

//Route to submit the edit form to update the data and redirect updated information to the main page
app.post("/edited", async (req, res) => {

    const book = req.body;


    try {

        const result = await db.query("Update booknote set title=$1, author=$2, review=$3, rating=$4 where isbn = $5",
            [book.editTitle, book.editAuthor,  book.editReview, book.editRating, book.editIsbn]
        );

        res.redirect("/");

    }catch(err){

        console.log(err);
    }

});

//Route to delete an id of the book
app.post("/delete", async (req, res) => {

    const deleteId = req.body.id;

    try{

        const result = await db.query("Delete from booknote where id = $1", [deleteId] );

        res.redirect("/");

    }catch(err){

        console.log(err)
    }
});

//Starts the server on the port that was intialized
app.listen(port, () => {
    console.log("Listening to port " + port);
});