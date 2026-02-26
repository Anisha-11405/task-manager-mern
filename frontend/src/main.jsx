import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./styles.css";

const API = "http://localhost:5000/api/v1";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      setToken(res.data.token);
      setIsLoggedIn(true);
      setMessage("Login successful ✅");
    } catch (err) {
      setMessage("Invalid credentials ❌");
    }
  };

  const register = async () => {
    try {
      await axios.post(`${API}/auth/register`, { name: "User", email, password });
      setMessage("Registered successfully 🎉 Now login");
    } catch (err) {
      setMessage("Registration failed ❌");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch {
      setMessage("Failed to load tasks ❌");
    }
  };

  const addTask = async () => {
    if (!title) return;
    await axios.post(
      `${API}/tasks`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    fetchTasks();
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken("");
    setTasks([]);
    setMessage("Logged out 👋");
  };

  useEffect(() => {
    if (isLoggedIn) fetchTasks();
  }, [isLoggedIn]);

  return (
    <div className="container">
      <div className="card">
        <h1>Task Manager</h1>
<p className="subtitle">
  Organize your daily work efficiently
</p>

        {!isLoggedIn ? (
          <>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="btn-group">
              <button className="primary" onClick={login}>Login</button>
              <button className="secondary" onClick={register}>Register</button>
            </div>
          </>
        ) : (
          <>
            <div className="dashboard-header">
              <h2>Dashboard</h2>
              <button className="logout" onClick={logout}>Logout</button>
            </div>

            <div className="task-input">
              <input
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button className="primary" onClick={addTask}>
                Add
              </button>
            </div>

            <ul className="task-list">
              {tasks.length === 0 && <p>No tasks yet.</p>}
              {tasks.map((task) => (
                <li key={task._id}>{task.title}</li>
              ))}
            </ul>
          </>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);