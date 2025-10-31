import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, dueDate, userId } = req.body;
    if (!title || !userId) return res.status(400).json({ message: "Missing fields" });

    const todo = await Todo.create({ title, dueDate, userId });
    res.status(201).json(todo);
  } catch {
    res.status(500).json({ message: "Failed to create todo" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json(todo);
  } catch {
    res.status(500).json({ message: "Failed to update todo" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete todo" });
  }
};
