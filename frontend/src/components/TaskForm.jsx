import React, { useState, useEffect } from "react";
import { CATEGORIES, PRIORITIES } from "../utils";

export default function TaskForm({ onSubmit, taskToEdit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Teaching",
    priority: "Medium",
    dueDate: "",
    completed: false
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        category: taskToEdit.category || "Teaching",
        priority: taskToEdit.priority || "Medium",
        dueDate: taskToEdit.dueDate || "",
        completed: Boolean(taskToEdit.completed)
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Teaching",
        priority: "Medium",
        dueDate: "",
        completed: false
      });
    }
    setError("");
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    setError("");
    onSubmit(formData);
  };

  const isEditing = Boolean(taskToEdit);

  return (
    <div className="card task-form-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            {isEditing ? "✏️ Edit Task" : "➕ Create New Academic Task"}
          </h2>
          <p className="card-subtitle">
            {isEditing
              ? "Update details for this faculty task"
              : "Track lectures, papers, grading, deadlines or committee meetings"}
          </p>
        </div>
        {isEditing && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel Edit
          </button>
        )}
      </div>

      {error && <div className="form-error-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="task-title">
            Task Title <span className="required-star">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g., Prepare Operating Systems Lecture 10 Slides"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-desc">Description</label>
          <textarea
            id="task-desc"
            className="form-input form-textarea"
            placeholder="Add relevant notes, class sections, syllabus points, or venue..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="task-category">Category</label>
            <select
              id="task-category"
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              className="form-input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label htmlFor="task-duedate">Due Date</label>
            <input
              id="task-duedate"
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        {isEditing && (
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              />
              <span>Mark this task as completed</span>
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Save Changes" : "Create Task"}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
