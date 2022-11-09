const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const bookScheme = new Schema({name: String, 
    author: String, genre: String, pages: Number}, 
    {versionKey: false});
const Book = mongoose.model("Book", bookScheme);
 
app.use(express.static(__dirname + "/public"));
 
// підключення до бази даних
mongoose.connect("mongodb://localhost:27017/booksdb", 
    { useUnifiedTopology: true, useNewUrlParser: true}, 
    function(err){
    if (err) 
        return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер очікує на підключення...");
    });
});

// для отримання книг
app.get("/api/books", function(req, res){
        
    Book.find({}, function(err, books){
        if(err) 
            return console.log(err);
        res.send(books)
    });
});
 
// для отримання книги
app.get("/api/books/:id", function(req, res){
         
    const id = req.params.id;
    Book.findOne({_id: id}, function(err, book){       
        if(err) 
            return console.log(err);
        res.send(book);
    });
});
    
// для додавання книги в базу даних
app.post("/api/books", jsonParser, function (req, res) {
        
    if(!req.body) 
        return res.sendStatus(400);
        
    const bookName = req.body.name;
    const bookAuthor = req.body.author;
    const bookGenre = req.body.genre;
    const bookPages = req.body.pages;
    const book = new Book({name: bookName, 
        author: bookAuthor, genre: bookGenre, pages: bookPages});
        
    book.save(function(err){
        if(err) 
            return console.log(err);
        res.send(book);
    });
});

// для вилучення книги із бази даних
app.delete("/api/books/:id", function(req, res){
         
    const id = req.params.id;
    Book.findByIdAndDelete(id, function(err, book){            
        if(err) 
            return console.log(err);
        res.send(book);
    });
});

// для оновлення інформації про книгу
app.put("/api/books", jsonParser, function(req, res){
         
    if(!req.body) 
        return res.sendStatus(400);
    const id = req.body.id;
    const bookName = req.body.name;
    const bookAuthor = req.body.author;
    const bookGenre = req.body.genre;
    const bookPages = req.body.pages;
    const newBook = {author: bookAuthor, 
        name: bookName, genre: bookGenre, pages: bookPages};
     
    Book.findOneAndUpdate({_id: id}, newBook, {new: true}, 
        function(err, book){
        if(err) 
            return console.log(err); 
        res.send(book);
    });
});
