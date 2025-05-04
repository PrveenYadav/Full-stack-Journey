import {useContext, createContext} from "react"

export const TodoContext = createContext({
    todos: [
        {
            id: 1,
            todoMsg: " Todo message",
            completed: false, 
        }
    ],

    addTodo: (todoMsg) => {},
    editTodo: (id, todoMsg) => {},
    deleteTodo: (id) => {},
    isCompleted: (id) => {}
})

export const useTodo = () => {
    return useContext(TodoContext);
}

export const TodoProvider = TodoContext.Provider