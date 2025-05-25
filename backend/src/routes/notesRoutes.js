import express from "express";
import { getAllNotes,createNote,updateNote,deleteNote,getNoteById } from "../controllers/notesControllers.js";
import { validateNote } from '../middleware/validateNote.js';

const router=express.Router();

router.get("/",getAllNotes);
router.get("/:id",getNoteById);

router.post("/",validateNote,createNote);
router.put("/:id",validateNote,updateNote);
router.delete("/:id",deleteNote);

export default router;


