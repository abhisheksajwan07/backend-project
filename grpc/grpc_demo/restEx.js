import express from "express";
const app = express();
app.use(express.json());
let todos = [];
// ✅ Create Todo  (rpc Create)
app.post("/todo", (req, res) => {
  const { id, title, content } = req.body;
  const todo = { id, title, content };
  todos.push(todo);
  res.status(201).json(todo);
});
// ✅ Get Todo by id (rpc Get)
app.get("/todo/:id", (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ message: "Not found" });
  res.json(todo);
});
// ✅ List all Todo (rpc List)
app.get("/todo", (req, res) => {
  res.json({ todos });
});
app.listen(3000, () => console.log("REST API running on port 3000"));

// maing are action based in grpc