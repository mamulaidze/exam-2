const API_URL = "https://exam-2-z1gz.onrender.com/api/todos";


export const getTodos = async () => {
  const res = await fetch(API_URL);
  return res.json();
};


export const createTodo = async (todo) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return res.json();
};


export const updateTodo = async (id, updatedData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  return res.json();
};


export const deleteTodo = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return res.json();
};
