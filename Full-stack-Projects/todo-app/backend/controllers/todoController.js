// Todo app controller 
import { Todo } from "../models/todoModel.js";

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find(); //getting all todos
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const addTodo = async (req, res) => {
    try {
        // taking todo info from the client
        const {title, description, isCompleted} = req.body
    
        if(!title) {
            return res.status(400).json({msg: "Title is required"});
        }

        // creating a newtodo
        const newTodo = new Todo({
            title,
            description: description || "", 
            isCompleted: isCompleted || false
        })

        // saving the newTodo in the database
        const savedTodo = await newTodo.save();
        
        // then returning the that todo
        res.status(201).json(savedTodo);

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const editTodo = async (req, res) => {
    try {
        //taking the id from params and info from the client
        const {id} = req.params
        const {title, description, isCompleted} = req.body
        
        //updating the todo
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            {title, description, isCompleted}
        );

        if(!updatedTodo) {
            return res.status(404).json({message: "Todo not found"});
        }

        res.status(200).json(updatedTodo);

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const deleteTodo = async (req, res) => {
    try {
        //taking the id from params and info from the client
        const {id} = req.params
        
        //updating the todo
        const deletedTodo = await Todo.findByIdAndDelete(id);

        if(!deleteTodo) {
            return res.status(404).json({message: "Todo not found"});
        }

        res.status(200).json(deleteTodo);

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const toggleComplete = async (req, res) => {
    try {
        const {id} = req.params;
        const todo = await Todo.findById(id);

        if(!todo) {
            return res.status(404).json({message: "Todo not found"});
        }

        todo.isCompleted = !todo.isCompleted;

        const updatedTodo = await todo.save();
        res.status(201).json(updatedTodo);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
