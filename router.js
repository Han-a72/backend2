import express from "express";
import { Book } from "../models/book.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// POST: Create a new book
router.post("/books", verifyToken, async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;
    const userId = req.user._id; // Get the userId from the verified token

    const newBook = new Book({
      title,
      author,
      publishYear,
      userId, // Save the userId with the book
    });

    await newBook.save();

    res.status(201).json({ message: "Book created successfully!", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Error creating the book. Please try again." });
  }
});

// DELETE: Delete a book
router.delete("/books/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Get userId from the token

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (book.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this book." });
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Error deleting the book. Please try again." });
  }
});

export default router;
