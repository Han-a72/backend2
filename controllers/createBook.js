import Book from('../models/Book');

// Function to create a new book
const createBook = async (req, res) => {
  const { title, author, publishYear } = req.body;

  if (!title || !author || !publishYear) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newBook = new Book({ title, author, publishYear });
    await newBook.save();
    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = createBook;
