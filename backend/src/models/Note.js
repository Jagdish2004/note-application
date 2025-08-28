import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;


