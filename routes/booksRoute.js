import express from 'express';
// import { Book } from '../models/bookModel.js';

import { getBooks,createBook,getBookInfo,updateBook,deleteBook } from '../controllers/bookController.js';
import verifyToken from '../middleWare/verifyToken.js';
const router = express.Router();



// GET route to fetch books created by the logged-in user

//.http://localhost:4000/books
router.get("/", getBooks);
router.post("/",createBook)
router.get("/:id", verifyToken, getBookInfo);
router.put("/:id", verifyToken, updateBook);
router.delete("/:id", verifyToken, deleteBook);
export default router;
