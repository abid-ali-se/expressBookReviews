const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
      return res.status(400).json({
        message: "Please provide valid username",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Please provide valid password",
      });
    }
    if (username && password) {
      if (!checkAlreadyExist(username)) {
        users.push({ username, password });
        return res.status(200).json({
          message: "user has been registered successfully",
        });
      } else {
        return res.status(400).json({
          message: "User already exist in the database",
        });
      }
    }
    return res
      .status(400)
      .json({ message: "There is an issue in user registration" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const readyBooks = JSON.stringify(books);
  if (readyBooks) {
    return res.status(200).json({
      message: "success",
      data: readyBooks,
    });
  } else {
    return res.status(404).json({
      message: "No Book Found",
      data: {},
    });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    let isbn = req.params.isbn;
    const book = Object.values(books).filter((book) => {
      return book?.isbn === isbn;
    });
    if (book.length > 0) {
      let bookDetails = book[0];
      return res.status(200).json({
        message: "success",
        data: bookDetails,
      });
    } else {
      return res.status(404).json({
        message: "No book found with provided isbn",
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    let author = req.params.author;
    const authorBooks = Object.values(books).filter((book) => {
      return book?.author === author;
    });
    if (book.length > 0) {
      return res.status(200).json({
        message: "success",
        data: authorBooks,
      });
    } else {
      return res.status(404).json({
        message: "No book found with provided author",
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    let title = req.params.title;
    const titleBooks = Object.values(books).filter((book) => {
      return book?.title === title;
    });
    if (book.length > 0) {
      return res.status(200).json({
        message: "success",
        data: titleBooks,
      });
    } else {
      return res.status(404).json({
        message: "No book found with provided title",
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  try {
    let isbn = req.params.isbn;
    const bookByIsbn = Object.values(books).filter((book) => {
      return book?.isbn === isbn;
    });
    if (bookByIsbn.length > 0) {
      let bookReviews = bookByIsbn[0]?.reviews;

      return res.status(200).json({
        message: "success",
        data: bookReviews,
      });
    } else {
      return res.status(404).json({
        message: "No book found with provided isbn with reviews",
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

module.exports.general = public_users;
