import { Notes } from "../models/notesModel.js";

export const getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const addNotes = async (req, res) => {
    try {
        const {title, description} = req.body;

        if (!title) return res.status(400).json({message: "Title is required"});

        const newNote = new Notes({
            title,
            description,
        })
        const savedNotes = await newNote.save();

        // OR Option 2: using create (saves directly)
        // const savedNote = await Notes.create({ title, description });
        res.status(201).json(savedNotes);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const editNotes = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, description} = req.body;

        const updatedNotes = await Notes.findByIdAndUpdate(id, {title, description});
        if(!updatedNotes) return res.status(404).json({message: "Note not found"});

        res.status(201).json(updatedNotes);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const deleteNotes = async (req, res) => {
    try {
        const {id} = req.params;

        const deletedNote = await Notes.findByIdAndDelete(id);
        if(!deletedNote) return res.status(404).json({message: "Note not found"});

        res.status(200).json(deletedNote)
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}
