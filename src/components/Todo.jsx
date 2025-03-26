import { useState,useEffect } from "react";
import React from "react";

const Todo = () => {
  const [todo, setTodo] = useState(JSON.parse(localStorage.getItem("todos")) || []);
  const [completed, setCompleted] = useState(JSON.parse(localStorage.getItem("completed")) || []);
  const [newTodo, setNewTodo] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const savedCompleted = JSON.parse(localStorage.getItem("completed")) || [];
    setTodo(savedTodos);
    setCompleted(savedCompleted);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todo));
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [todo, completed]);

  const handleInput = (e) => {
    setNewTodo(e.target.value);
  };

  const addTodo = () => {
    if (newTodo.trim() !== "" && !editMode) {
      setTodo([...todo, newTodo]);
      setCompleted([...completed, false]);
      setNewTodo("");
    }
  };

  const toggleComplete = (index) => {
    if (!editMode) {
      const updatedCompleted = [...completed];
      updatedCompleted[index] = !updatedCompleted[index];
      setCompleted(updatedCompleted);
    }
  };

  const handleEdit = (index, value) => {
    const updatedTodos = [...todo];
    updatedTodos[index] = value;
    setTodo(updatedTodos);
  };

  const moveUp = (index) => {
    if (index > 0) {
      const updatedTodos = [...todo];
      const updatedCompleted = [...completed];
      [updatedTodos[index], updatedTodos[index - 1]] = [
        updatedTodos[index - 1],
        updatedTodos[index],
      ];
      [updatedCompleted[index], updatedCompleted[index - 1]] = [
        updatedCompleted[index - 1],
        updatedCompleted[index],
      ];
      setTodo(updatedTodos);
      setCompleted(updatedCompleted);
    }
  };

  const moveDown = (index) => {
    if (index < todo.length - 1) {
      const updatedTodos = [...todo];
      const updatedCompleted = [...completed];
      [updatedTodos[index], updatedTodos[index + 1]] = [
        updatedTodos[index + 1],
        updatedTodos[index],
      ];
      [updatedCompleted[index], updatedCompleted[index + 1]] = [
        updatedCompleted[index + 1],
        updatedCompleted[index],
      ];
      setTodo(updatedTodos);
      setCompleted(updatedCompleted);
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = todo.filter((_, i) => i !== index);
    const updatedCompleted = completed.filter((_, i) => i !== index);
    setTodo(updatedTodos);
    setCompleted(updatedCompleted);
  };
  const deleteAll = () => {
    if (todo.length > 0 && window.confirm("Are you sure you want to delete all tasks?")) {
      setTodo([]);
      setCompleted([]);
    };
  };

  return (
    <div className=" min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="font text-3xl font-bold mb-4">TO DO LIST</h1>

      <div className="flex gap-4">
        <button
          className="mb-4 text-2xl p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          onClick={() => {
            if (todo.length > 0) {
              setEditMode(!editMode);
            }
          }}
        >
          {editMode && (todo.length > 0) ? "Done" : "Edit"}
        </button>
        <button onClick={deleteAll} className="mb-4 text-2xl p-2 bg-gray-200 rounded hover:bg-gray-300 transition">Delete All</button></div>

      <div className="flex w-full max-w-md gap-2">
        <input
          type="text"
          placeholder="Add todo..."
          value={newTodo}
          onChange={handleInput}
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      <ol className="mt-6 w-full max-w-md space-y-2">
        {todo.length === 0 && <p className="text-gray-500 text-xl text-center">No Tasks Present...</p>}
        {todo.map((task, index) => (
          <li
            onClick={() => toggleComplete(index)}
            key={index}
            className={`flex items-center justify-between bg-white p-3 rounded shadow cursor-pointer ${completed[index] ? "line-through text-gray-500" : ""
              }`}
          >
            {editMode ? (
              <input
                type="text"
                value={task}
                onChange={(e) => handleEdit(index, e.target.value)}
                className="flex-1 outline-none border border-gray-300 rounded px-4 py-2"
                onClick={(e) => e.stopPropagation()} // Prevents toggling when clicking inside input
              />
            ) : (
              <span>{task}</span>
            )}

            {editMode && (
              <div className="flex gap-2">
                <button
                  className="p-1 border border-gray-300 rounded hover:bg-gray-200 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents toggling when clicking button
                    moveUp(index);
                  }}
                >
                  ⬆️
                </button>
                <button
                  className="p-1 border border-gray-300 rounded hover:bg-gray-200 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveDown(index);
                  }}
                >
                  ⬇️
                </button>
                <button
                  className="p-1 border border-red-400 text-red-600 rounded hover:bg-red-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(index);
                  }}
                >
                  🗑️
                </button>
              </div>
            )}
          </li>

        ))}
      </ol>

    </div>
  );
};

export default Todo;
