// src/bookstore.js
const express = require('express');
const router = express.Router();
const Book = require('../Models/bookmodel'); // Create a Book model
const User = require('../Models/user');
// Task 1: Get the book list available in the shop
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Task 2: Get the books based on ISBN
router.get('/books/:isbn', async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Task 3: Get all books by Author
router.get('/books/author/:author', async (req, res) => {
  try {
    const books = await Book.find({ author: req.params.author });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', async (req, res) => {
    try {
      const { title, author, isbn } = req.body;
  
      // Check if a book with the same ISBN already exists
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: 'Book with this ISBN already exists' });
      }
  
      const newBook = new Book({ title, author, isbn });
      await newBook.save();
  
      res.json({ message: 'Book added successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
// Task 4: Get all books based on Title
router.get('/books/title/:title', async (req, res) => {
  try {
    const books = await Book.find({ title: req.params.title });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/books/reviews/:rating', async (req, res) => {
    try {
      const { rating } = req.params;
      const books = await Book.find({ 'reviews.rating': rating });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Task 6: Register New user
router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
  
      // Create a new user
      const newUser = new User({ username, password });
  
      // Save the user to the database
      await newUser.save();
  
      res.json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Task 7: Login as a Registered user
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username and password
      const user = await User.findOne({ username, password });
  
      if (user) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Task 8: Add/Modify a book review
router.put('/books/:isbn/reviews', async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (book) {
      const { username, rating, comment } = req.body;
      book.reviews.push({ username, rating, comment });
      await book.save();
      res.json(book.reviews);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Task 9: Delete book review added by that particular user
router.delete('/books/:isbn/reviews', async (req, res) => {
  try {
    
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (book) {
      const { username } = req.body;
      book.reviews = book.reviews.filter(review => review.username !== username);
      await book.save();
      let isbn = req.params.isbn
      res.json(`Review for the isbn number ${isbn} is been deleted`);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
