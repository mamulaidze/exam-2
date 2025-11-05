import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const API_URL = "https://exam-2-z1gz.onrender.com/api/todos";

  const loadTodos = async () => {
    if (!user) return;
    setLoading(true);
    const res = await fetch(`${API_URL}?userId=${user.id}`);
    const data = await res.json();
    setTodos(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoaded && user) loadTodos();
    else setTodos([]);
  }, [user, isLoaded]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate, userId: user.id }),
    });
    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setTitle("");
    setDueDate("");
  };

  const toggleTodo = async (id, completed) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    const updated = await res.json();
    setTodos((t) => t.map((todo) => (todo._id === id ? updated : todo)));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTodos((t) => t.filter((todo) => todo._id !== id));
  };

  const editTodo = (todo) => {
    setEditing({
      id: todo._id,
      title: todo.title,
      dueDate: todo.dueDate ? todo.dueDate.split("T")[0] : "",
    });
  };

  const saveTodo = async () => {
    const res = await fetch(`${API_URL}/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editing.title,
        dueDate: editing.dueDate,
      }),
    });
    const updated = await res.json();
    setTodos((t) => t.map((todo) => (todo._id === updated._id ? updated : todo)));
    setEditing(null);
  };

  const filtered = todos.filter((t) => {
    const now = new Date();
    const due = t.dueDate ? new Date(t.dueDate) : null;
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    if (filter === "upcoming") return due && due > now;
    if (filter === "overdue") return due && due < now && !t.completed;
    return true;
  });

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Please sign in to manage your tasks 🧠
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-semibold text-indigo-600">
          {user.firstName}’s Dashboard
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-3 py-1 text-gray-700 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="upcoming">Upcoming</option>
          <option value="overdue">Overdue</option>
        </select>
      </header>

      <main className="flex flex-col md:flex-row flex-1 gap-6 p-6">
        <section className="md:w-1/3 bg-white shadow-md rounded-xl p-5">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Add New Task</h2>
          <form onSubmit={addTodo} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md font-medium"
            >
              Add Task
            </button>
          </form>
        </section>

        <section className="flex-1 bg-white shadow-md rounded-xl p-5 flex flex-col">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks
          </h2>
          <div className="flex-1 overflow-y-auto max-h-[65vh] pr-1">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-400 italic">No tasks found.</p>
            ) : (
              <ul className="space-y-3">
                {filtered.map((todo) => (
                  <li
                    key={todo._id}
                    className="flex items-center justify-between p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition"
                  >
                    {editing?.id === todo._id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={editing.title}
                          onChange={(e) =>
                            setEditing({ ...editing, title: e.target.value })
                          }
                          className="flex-1 px-3 py-2 border rounded-md"
                        />
                        <input
                          type="date"
                          value={editing.dueDate}
                          onChange={(e) =>
                            setEditing({ ...editing, dueDate: e.target.value })
                          }
                          className="px-3 py-2 border rounded-md"
                        />
                        <button
                          onClick={saveTodo}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={() => toggleTodo(todo._id, todo.completed)}
                          className={`flex-1 cursor-pointer ${
                            todo.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          <div className="font-medium">{todo.title}</div>
                          {todo.dueDate && (
                            <div className="text-sm text-gray-500">
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => editTodo(todo)}
                            className="text-indigo-500 hover:text-indigo-700"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
