import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    // axios instance
    const api = axios.create({ baseURL });

    const [todos, setTodos] = useState([]);

    // ---- CRUD functions ----

    // Get all todos
    const getTodos = async () => {
        try {
            const res = await api.get('/todos');
            setTodos(res.data);
        } catch (error) {
            console.log("Error in fetching data", error.message)
        }
    }

    // Add new todo
    const addTodo = async (todo) => {
        try {
            const res = await api.post("/todos", todo);
            // setTodos([...todos, res.data]);
            setTodos((prevTodos) => [...prevTodos, res.data]);
        } catch (error) {
            console.error("Error adding todo:", error.message);
        }
    };

    // Edit todo
    const editTodo = async (id, newTodo) => {
        try {
            const res = await api.patch(`/todos/${id}`, newTodo);
            setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
        } catch (error) {
            console.error("Error editing todo:", error.message);
        }
    }

    // Toggle complete
    const toggleComplete = async (id) => {
        try {
            const res = await api.patch(`/todos/${id}/toggle`);
            const updatedTodo = res.data;

            setTodos((prevTodos) => prevTodos.map((todo) => todo._id === id ? updatedTodo : todo));

        } catch (error) {
            console.error("Error toggling todo:", error.message);
        }
    }

    // Delete Todo
    const deleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error.message);
        }
    }


    // fetch todos on first load
    useEffect(() => {
        getTodos();
    }, []);

    const value = {
        baseURL, todos, getTodos, addTodo, editTodo, toggleComplete, deleteTodo,
    }

    return (
        <TodoContext.Provider value={value}>
        {children}
        </TodoContext.Provider>
    );
};

export const UseTodoContext = () => {
    return useContext(TodoContext);
}
