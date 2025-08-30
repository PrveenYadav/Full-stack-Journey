import React, { useEffect, useState } from 'react'
import { UseTodoContext } from './context/todoContext.jsx'

const App = () => {

  const {todos, getTodos, addTodo, editTodo, toggleComplete, deleteTodo,} = UseTodoContext();
  const [todo, setTodo] = useState('');
  const [desc, setDesc] = useState('');
  const [editId, setEditId] = useState(null); // track which todo is being edited
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // console.log(todos)

  useEffect(() => {
    getTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (todo.trim() === '') return;
    await addTodo({ title: todo, description: desc, isCompleted: false });
    setTodo('');
    setDesc('');
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
  };

  const handleToggleComplete = async (id) => {
    await toggleComplete(id);
  };

  const handleEditSave = async (id) => {
    if (editTitle.trim() === "") return;
    await editTodo(id, { title: editTitle, description: editDesc });
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
  };

  return (
    <div className="bg-gray-950 min-h-screen w-screen text-white flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="mt-6 text-4xl font-extrabold text-violet-400 tracking-wide">🚀 Full-stack Todo App</h1>

      {/* Input Form */}
      <form onSubmit={handleAddTodo} className="mt-8 flex gap-2 bg-gray-800 p-4 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="✍️ Write todo..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="w-60 outline-none bg-gray-700 px-3 py-2 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500"
        />
        <input
          type="text"
          placeholder="📝 Add description..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-60 outline-none bg-gray-700 px-3 py-2 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500"
        />
        <button type="submit" className="px-4 py-2 bg-violet-500 rounded-lg font-semibold hover:bg-violet-600 transition cursor-pointer">
          Add ➕
        </button>
      </form>

      {/* Todo List */}
      <ul className="mt-10 flex flex-col gap-4 w-full max-w-lg">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`p-4 rounded-xl shadow-md transition-all ${
              todo.isCompleted
                ? "bg-green-600 line-through opacity-80"
                : "bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              {/* Left Section */}
              {editId === todo._id ? (
                <div className="flex flex-col flex-1 gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border border-gray-600 rounded p-2 bg-gray-900 text-white"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="border border-gray-600 rounded p-2 bg-gray-900 text-white"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => handleToggleComplete(todo._id)}
                    className="w-5 h-5 accent-violet-500 cursor-pointer"
                  />
                  <div>
                    <h2 className="font-bold text-lg">{todo.title}</h2>
                    <p className="text-sm text-gray-300">{todo.description}</p>
                  </div>
                </div>
              )}

              {/* Right Section (Buttons) */}
              <div className="flex gap-2">
                {editId === todo._id ? (
                  <>
                    <button
                      onClick={() => handleEditSave(todo._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      ❎ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(todo._id);
                        setEditTitle(todo.title);
                        setEditDesc(todo.description);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      🗑 Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

}

export default App