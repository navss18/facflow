import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskDetailModal from "./components/TaskDetailModal";

const API_BASE = "http://localhost:5000/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'tasks' | 'add'
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (text, type = "success") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.text === text ? null : curr));
    }, 3500);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      showNotification("Could not reach backend API. Ensure server is running on port 5000.", "error");
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const info = await res.json();
        setServerInfo(info);
      }
    } catch {
      setServerInfo(null);
    }
  };

  useEffect(() => {
    loadTasks();
    checkHealth();
  }, []);

  const handleCreateOrUpdateTask = async (formData) => {
    try {
      if (taskToEdit) {
        // Update task
        const res = await fetch(`${API_BASE}/tasks/${taskToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Update failed");
        showNotification("Task updated successfully!");
        setTaskToEdit(null);
        setActiveTab("tasks");
      } else {
        // Create new task
        const res = await fetch(`${API_BASE}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Create failed");
        showNotification("New task added to your workload!");
        setActiveTab("tasks");
      }
      loadTasks();
    } catch (err) {
      console.error(err);
      showNotification("Failed to save task. Please try again.", "error");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const nextStatus = !task.completed;
      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextStatus })
      });
      if (!res.ok) throw new Error("Toggle status failed");

      // Update local state quickly
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: nextStatus } : t))
      );

      // Also update viewingTask if open
      if (viewingTask && viewingTask.id === task.id) {
        setViewingTask((prev) => ({ ...prev, completed: nextStatus }));
      }

      showNotification(
        nextStatus ? `Task marked as completed! 🎉` : `Task marked as pending.`
      );
    } catch (err) {
      console.error(err);
      showNotification("Could not update task status.", "error");
    }
  };

  const handleDeleteTask = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title || "this task"}"?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Delete failed");
      showNotification("Task deleted successfully.");
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (viewingTask && viewingTask.id === id) {
        setViewingTask(null);
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete task.", "error");
    }
  };

  const handleStartEdit = (task) => {
    setTaskToEdit(task);
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    setTaskToEdit(null);
    setActiveTab("tasks");
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== "add" && taskToEdit) {
            setTaskToEdit(null);
          }
          setActiveTab(tab);
        }}
        taskCount={tasks.length}
        serverInfo={serverInfo}
      />

      {notification && (
        <div className={`notification-toast toast-${notification.type}`}>
          <span>{notification.text}</span>
          <button
            className="toast-close"
            onClick={() => setNotification(null)}
          >
            &times;
          </button>
        </div>
      )}

      <main className="main-content">
        {loading && tasks.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading faculty tasks...</p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <Dashboard
                tasks={tasks}
                setActiveTab={setActiveTab}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleStartEdit}
                onViewTask={setViewingTask}
              />
            )}

            {activeTab === "tasks" && (
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleStartEdit}
                onDeleteTask={handleDeleteTask}
                onViewTask={setViewingTask}
                onAddNew={() => {
                  setTaskToEdit(null);
                  setActiveTab("add");
                }}
              />
            )}

            {activeTab === "add" && (
              <TaskForm
                onSubmit={handleCreateOrUpdateTask}
                taskToEdit={taskToEdit}
                onCancel={handleCancelEdit}
              />
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>
          <strong>Faculty Flow</strong> — Organize Work. Save Time. Focus on Teaching.
        </p>
        <p className="footer-sub">
          Academic Task Management System for College Faculty
        </p>
      </footer>

      {viewingTask && (
        <TaskDetailModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={handleStartEdit}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
