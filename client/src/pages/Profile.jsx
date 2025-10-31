import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user } = useUser();
  const [todos, setTodos] = useState([]);
  const API_URL = "http://localhost:5000/api/todos";

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_URL}?userId=${user.id}`);
        const data = await res.json();
        setTodos(Array.isArray(data) ? data : []);
      } catch {
        setTodos([]);
      }
    };
    fetchTodos();
  }, [user]);

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Please sign in to view your profile
      </div>
    );

  const completed = todos.filter((t) => t.completed).length;
  const pending = todos.length - completed;
  const progress = todos.length ? (completed / todos.length) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-md p-6 flex items-center flex-wrap gap-4">
        <img
          src={user.imageUrl}
          alt={user.fullName}
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-300"
        />
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {user.fullName}
          </h1>
          <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <p className="text-3xl font-semibold text-blue-600">{pending}</p>
                <p className="text-gray-600 text-sm">Pending</p>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-3">
                <p className="text-3xl font-semibold text-green-600">{completed}</p>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-700 mb-2 font-medium">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right text-gray-500 text-sm mt-1">
              {Math.round(progress)}%
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6 flex flex-col h-[70vh]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Tasks</h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
            {todos.length === 0 ? (
              <p className="text-gray-500 italic text-center mt-10">No tasks found.</p>
            ) : (
              <ul className="space-y-3">
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:justify-between sm:items-center ${
                      todo.completed ? "bg-gray-100" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`font-medium ${
                        todo.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.title}
                      {todo.dueDate && (
                        <span className="block text-sm text-gray-500">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-sm mt-2 sm:mt-0 ${
                        todo.completed ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #b0b0b0; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #888; }
      `}</style>
    </div>
  );
}
