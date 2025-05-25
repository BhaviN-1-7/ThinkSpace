import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
    try {
        const notes = await Note.find()
            .sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getNoteById(req, res) {
    try {
        const { id } = req.params;
        
        const note = await Note.findById(id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function createNote(req, res) {
    try {
        const { title, content, tags, color } = req.body;
        
        const note = await Note.create({
            title,
            content,
            tags,
            color
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateNote(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // First check if note exists
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Merge the existing note with the update data
        const updatedData = {
            ...note.toObject(),
            ...updateData
        };

        // Update the note
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({ message: error.message });
    }
}

export async function deleteNote(req, res) {
    try {
        const { id } = req.params;

        const note = await Note.findById(id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await Note.findByIdAndDelete(id);
        
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}