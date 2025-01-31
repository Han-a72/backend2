import { Book } from "../models/bookModel.js";


export const getBooks=async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId }); // Filter books by userId
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
}
export const createBook = async (req, res) => {
  const { title, author, publishYear } = req.body;

  if (!title || !author || !publishYear) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newBook = new Book({ title, author, publishYear });
    await newBook.save();
    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
};





// Get book by ID (for Info)
export const getBookInfo = async (req, res) => {
  const { id } = req.params;  // Get book ID from URL params

  try {
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);  // Return the book details
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit book by ID (for Update)
export const updateBook = async (req, res) => {
  const { id } = req.params;  // Get book ID from URL params
  const { title, author, publishYear } = req.body;  // Get updated data from request body

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, publishYear },
      { new: true }  // Return the updated book
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);  // Return the updated book
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete book by ID
export const deleteBook = async (req, res) => {
  const { id } = req.params;  // Get book ID from URL params

  try {
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });  // Return success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
