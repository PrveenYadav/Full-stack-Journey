import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NoteContext = createContext();

export const NoteProvider = ({children}) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const api = axios.create({baseURL});

    const [notes, setNotes] = useState([]);

    const getNotes = async () => {
        try {
            const res = await api.get('/notes');
            setNotes(res.data);
        } catch (error) {
            console.log("Error in Fetching data", error.message);
        }
    }

    const addNotes = async (note) => {
        try {
            const res = await api.post('/notes', note);
            setNotes((prevNotes) => [...prevNotes, res.data]);
        } catch (error) {
            console.log("Error in adding note", error.message);
        }
    }

    const editNotes = async (id, newNote) => {
        try {
            const res = await api.patch(`/notes/${id}`, newNote);
            setNotes((notes.map((note) => (note._id === id ? res.data : note))));
        } catch (error) {
            console.log("Error in editing note", error.message);
        }
    }

    const deleteNotes = async (id) => {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note._id !== id))
        } catch (error) {
            console.log("Error in deleting note", error.message);
        }
    }

    //fetch all notes on the first load
    useEffect(() => {
        getNotes();
    }, [])

    const value = {
        notes, setNotes, getNotes, addNotes, editNotes, deleteNotes
    }

    return (
        <NoteContext.Provider value={value}>
            {children}
        </NoteContext.Provider>
    )
}

export const useNoteContext = () => {
    return useContext(NoteContext);
}