import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the User model
      required: true, // Enforcing that a userId is required
      ref: 'User',  // Assuming you have a User model in your app
    },
  },
  {
    timestamps: true, // Correct spelling for timestamps
  }
);

export const Book = mongoose.model('mybook', bookSchema);
