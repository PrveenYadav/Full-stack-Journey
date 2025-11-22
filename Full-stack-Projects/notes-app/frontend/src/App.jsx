import React, { useContext, useEffect, useState } from 'react'
import { useNoteContext } from './context/noteContext';

const App = () => {

  const {notes, getNotes, addNotes, editNotes, deleteNotes} = useNoteContext();
  const [note, setNote] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!note.trim() || !desc.trim()) return;

    if (editingId) {
      await editNotes(editingId, { title: note, description: desc });
      setEditingId(null);
    } else {
      await addNotes({ title: note, description: desc });
    }
    setNote("");
    setDesc("");
  };

  const handleEdit = (n) => {
    setNote(n.title);
    setDesc(n.description);
    setEditingId(n._id);
  };

  const handleDelete = async (id) => {
    await deleteNotes(id);
  };

  return (
    <div className="min-h-screen bg-black/90 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mb-6">📝 Notes App</h1>

      {/* Form */}
      <form
        onSubmit={handleAdd}
        className="text-gray-300 shadow-violet-500 shadow-xs rounded-xl p-4 w-full max-w-md mb-6"
      >
        <input
          type="text"
          placeholder="Title"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-white/5 p-2 shadow-md outline-none rounded mb-3 focus:ring focus:ring-blue-300"
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-white/5 p-2 shadow-md outline-none rounded mb-3 focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      <div className="grid lg:grid-cols-2 gap-4 w-full max-w-2xl">
        {notes && notes.length > 0 ? (
          notes.map((n, index) => (
            <div
              key={n._id || index}
              className="bg-white/5 text-gray-200 p-4 rounded-xl shadow flex justify-between items-start"
            >
              <div>
                <h2 className="font-bold text-lg">{n.title}</h2>
                <p className="text-gray-400">{n.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(n)}
                  className="px-3 py-1 text-sm bg-yellow-400 text-black cursor-pointer rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No notes found. Add one!</p>
        )}
      </div>
    </div>
  );
}

export default App