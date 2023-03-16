const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (users.length > 0) {
    users.filter((user) => {
      if (user.username === username) {
        return true;
      }
      return false;
    });
  }
};
//commit changes
const authenticatedUser = (username, password) => {
  if (users.length > 0) {
    users.filter((user) => {
      if (user.username === username && user.password === password) {
        return true;
      }
      return false;
    });
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(400).json({
        message: "Invalid parameters. Provide username and passowrd",
      });
    }
    if (authenticatedUser(username, password)) {
      let token = jwt.sign({ username }, "fingerprint_customer", {
        expiresIn: 60 * 60,
      });
      req.session.authorization = {
        token,
        username,
      };
      return res.status(200).send("User logged in the system");
    } else {
      return res.status(400).json({
        message: "Invalid usernae or password",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username;
    if (!isbn || !review || !username) {
      return res.status(400).send("Missing required parameters");
    }
    books.map((book) => {
      let bookReviews = book.reviews;
      if (bookReviews[isbn]) {
        const existingReview = bookReviews[isbn].find(
          (r) => r.username === username
        );
        if (existingReview) {
          // User has already reviewed this book, update their review
          existingReview.review = review;
          return res.status(200).send("Review updated successfully");
        }
      } else {
        bookReviews[isbn] = [];
      }
      // Add new review to bookReviews data store
      bookReviews[isbn].push({ username: username, review: review });
    });
    res.status(200).send("Review added successfully");
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.session.username;

    // Find the review(s) for the given book and the current user
    const reviews = db.reviews.filter(
      (review) => review.isbn === isbn && review.username === username
    );

    if (reviews.length === 0) {
      // If no matching reviews were found, return a 404 error
      return res.status(404).json({ error: "Review not found" });
    } else {
      // Delete the matching reviews from the database
      db.reviews = db.reviews.filter(
        (review) => review.isbn !== isbn || review.username !== username
      );

      // Return a success message
      return res.json({ message: "Review deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
